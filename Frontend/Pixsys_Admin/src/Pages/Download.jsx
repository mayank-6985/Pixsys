import React, { useMemo, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiDownload,
} from "react-icons/fi";
import { Loader2 } from "lucide-react";
import {
  useAllDownloads,
  useUpdateDownload,
  useDeleteDownload,
  useCreateDownload,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
} from "../hooks/useDownloads";
import { useAdminProductsData, useCategoryDetails } from "../hooks/useProducts";

import S3Uploader from "../Components/S3Uploader";

const emptyDownload = {
  product_id: "",
  tag_id: "",
  subcategory_id: "",
  category_id: "",
  name: "",
  resource_url: "",
  resource_type: "SOFTWARE",
  description: "",
  thumbnail: "",
};

const Download = () => {
  const { data, isLoading: isDownloadsLoading } = useAllDownloads();
  const updateMutation = useUpdateDownload();
  const deleteMutation = useDeleteDownload();
  const createMutation = useCreateDownload();
  const createResMutation = useCreateResource();
  const updateResMutation = useUpdateResource();
  const deleteResMutation = useDeleteResource();

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    createResMutation.isPending ||
    updateResMutation.isPending;

  const hasError =
    createMutation.isError ||
    updateMutation.isError ||
    createResMutation.isError ||
    updateResMutation.isError;

  const resetMutations = () => {
    createMutation.reset();
    updateMutation.reset();
    createResMutation.reset();
    updateResMutation.reset();
  };

  const [view, setView] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyDownload);

  const [selCat, setSelCat] = useState("");
  const [selSub, setSelSub] = useState("");
  const [selTag, setSelTag] = useState("");
  const [selProd, setSelProd] = useState("");

  const { data: productsData } = useAdminProductsData();
  const { data: detailedCategoryData, isLoading: isDetailsLoading } =
    useCategoryDetails(selCat);

  const categories = useMemo(() => {
    if (Array.isArray(productsData)) return productsData;
    if (productsData?.data && Array.isArray(productsData.data))
      return productsData.data;
    return [];
  }, [productsData]);

  const subOptions = useMemo(() => {
    if (!selCat || !detailedCategoryData) return [];
    if (Array.isArray(detailedCategoryData)) return detailedCategoryData;
    if (detailedCategoryData?.data) return detailedCategoryData.data;
    if (detailedCategoryData?.subcategories)
      return detailedCategoryData.subcategories;
    return [];
  }, [detailedCategoryData, selCat]);

  const currentSubcategory = useMemo(() => {
    if (!selSub) return null;
    return (
      subOptions.find((s) => String(s.subcategory_id) === String(selSub)) ||
      null
    );
  }, [subOptions, selSub]);

  const tagOptions = useMemo(
    () => currentSubcategory?.tags || [],
    [currentSubcategory],
  );

  const currentTag = useMemo(() => {
    if (!selTag) return null;
    return tagOptions.find((t) => String(t.tag_id) === String(selTag)) || null;
  }, [tagOptions, selTag]);

  const prodOptions = useMemo(() => currentTag?.products || [], [currentTag]);

  const _raw = data?.data ?? data?.results ?? data ?? [];
  const allDownloads = Array.isArray(_raw)
    ? _raw
    : typeof _raw === "object" && _raw !== null
      ? Object.values(_raw).flat().filter(Boolean)
      : [];

  const filteredDownloads = useMemo(() => {
    return allDownloads.filter((d) => {
      if (selProd) return String(d.product_id) === String(selProd);
      if (selTag) return String(d.tag_id) === String(selTag);
      if (selSub) return String(d.subcategory_id) === String(selSub);
      if (selCat) return String(d.category_id) === String(selCat);
      return true;
    });
  }, [allDownloads, selCat, selSub, selTag, selProd]);

  const handleOpenCreate = () => {
    resetMutations();
    setEditingId(null);
    setFormData({
      ...emptyDownload,
      category_id: selCat || "",
      subcategory_id: selSub || "",
      tag_id: selTag || "",
      product_id: selProd || "",
    });
    setView("form");
  };

  const handleOpenEdit = (d) => {
    resetMutations();
    setEditingId(d.download_id || d.resource_id);
    setSelCat(d.category_id ?? "");
    setSelSub(d.subcategory_id ?? "");
    setSelTag(d.tag_id ?? "");
    setSelProd(d.product_id ?? "");
    setFormData({
      product_id: d.product_id ?? "",
      tag_id: d.tag_id ?? "",
      subcategory_id: d.subcategory_id ?? "",
      category_id: d.category_id ?? "",
      name: d.name ?? "",
      resource_url: d.resource_url ?? "",
      resource_type: d.resource_type ?? "SOFTWARE",
      description: d.description ?? "",
      thumbnail: d.thumbnail ?? "",
    });
    setView("form");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isResource = formData.resource_type === "RESOURCE";
      if (editingId) {
        if (isResource) {
          await updateResMutation.mutateAsync({
            ...formData,
            resource_id: editingId,
          });
        } else {
          await updateMutation.mutateAsync({
            ...formData,
            download_id: editingId,
          });
        }
      } else {
        if (isResource) {
          await createResMutation.mutateAsync({ ...formData });
        } else {
          await createMutation.mutateAsync({ ...formData });
        }
      }
      setView("list");
    } catch (err) {}
  };

  const handleDelete = async (item) => {
    const isResource = item.resource_type === "RESOURCE" || item.resource_id;
    const targetId = isResource ? item.resource_id : item.download_id;

    if (!targetId) {
      alert("Error: Could not find a valid ID to delete.");
      return;
    }

    if (window.confirm("Delete this item?")) {
      try {
        if (isResource) {
          await deleteResMutation.mutateAsync(targetId);
        } else {
          await deleteMutation.mutateAsync(targetId);
        }
      } catch (err) {
        alert("Something went wrong while trying to delete this item.");
      }
    }
  };

  if (view === "form") {
    return (
      <div className="min-h-screen bg-[#f8f9fa] p-4 sm:p-6 lg:p-8 w-full font-sans">
        <div className="max-w-3xl mx-auto bg-white border border-zinc-200 shadow-xl overflow-hidden">
          <div className="px-8 py-6 flex justify-between items-center border-b border-zinc-200 bg-zinc-900 text-white">
            <h1 className="text-lg font-bold uppercase tracking-widest">
              {editingId ? "Edit Download" : "Create Download"}
            </h1>
            <button
              onClick={() => setView("list")}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {hasError && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-[#da0e19] text-[#da0e19] text-sm font-medium rounded-r-md">
                  Something went wrong while processing your request. Please try
                  again.
                </div>
              )}

              {/* FIRST ROW: Name and Resource Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name || ""}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                    Resource Type *
                  </label>
                  <select
                    name="resource_type"
                    value={formData.resource_type || "SOFTWARE"}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm font-bold uppercase tracking-widest text-zinc-700 disabled:opacity-60"
                  >
                    <option value="SOFTWARE">SOFTWARE</option>
                    <option value="SOFTWARE_MANUAL">SOFTWARE_MANUAL</option>
                    <option value="CATALOG">CATALOG</option>
                    <option value="DIMENTION">DIMENTION</option>
                    <option value="RESOURCE">RESOURCE</option>
                  </select>
                </div>
              </div>

              {/* SECOND ROW: Description and Thumbnail (Only if RESOURCE) */}
              {formData.resource_type === "RESOURCE" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-200">
                  <div>
                    <label className="block text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="4"
                      value={formData.description || ""}
                      onChange={handleChange}
                      disabled={isSaving}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <S3Uploader
                      label="Upload Thumbnail *"
                      accept="image/*"
                      folder="thumbnails"
                      currentFileUrl={formData.thumbnail}
                      onUploadSuccess={(url) =>
                        setFormData((prev) => ({ ...prev, thumbnail: url }))
                      }
                    />
                    <input
                      type="hidden"
                      name="thumbnail"
                      required={formData.resource_type === "RESOURCE"}
                      value={formData.thumbnail || ""}
                    />
                  </div>
                </div>
              )}

              {/* THIRD ROW: Resource URL Upload */}
              <div className="pt-6 border-t border-zinc-200">
                <S3Uploader
                  label={`Upload ${formData.resource_type.replace("_", " ")} File *`}
                  accept={
                    formData.resource_type.includes("SOFTWARE")
                      ? ".exe,.zip,.rar,.msi"
                      : ".pdf,image/*"
                  }
                  folder={formData.resource_type.toLowerCase()}
                  currentFileUrl={formData.resource_url}
                  onUploadSuccess={(url) =>
                    setFormData((prev) => ({ ...prev, resource_url: url }))
                  }
                />

                <input
                  type="hidden"
                  name="resource_url"
                  required
                  value={formData.resource_url || ""}
                />
              </div>

              {/* FOURTH ROW: Product Linkage */}
              <div className="pt-6 border-t border-zinc-200">
                <h3 className="block text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">
                  Product Linkage *
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={selCat}
                    onChange={(e) => {
                      setSelCat(e.target.value);
                      setSelSub("");
                      setSelTag("");
                      setSelProd("");
                      setFormData((s) => ({
                        ...s,
                        category_id: e.target.value,
                        subcategory_id: "",
                        tag_id: "",
                        product_id: "",
                      }));
                    }}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm font-bold uppercase tracking-widest text-zinc-700"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selSub}
                    onChange={(e) => {
                      setSelSub(e.target.value);
                      setSelTag("");
                      setSelProd("");
                      setFormData((s) => ({
                        ...s,
                        subcategory_id: e.target.value,
                        tag_id: "",
                        product_id: "",
                      }));
                    }}
                    disabled={!selCat}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm font-bold uppercase tracking-widest text-zinc-700 disabled:opacity-50 disabled:bg-zinc-100"
                  >
                    <option value="">Select Subcategory</option>
                    {subOptions.map((s) => (
                      <option key={s.subcategory_id} value={s.subcategory_id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selTag}
                    onChange={(e) => {
                      setSelTag(e.target.value);
                      setSelProd("");
                      setFormData((s) => ({
                        ...s,
                        tag_id: e.target.value,
                        product_id: "",
                      }));
                    }}
                    disabled={!selSub}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm font-bold uppercase tracking-widest text-zinc-700 disabled:opacity-50 disabled:bg-zinc-100"
                  >
                    <option value="">Select Tag</option>
                    {tagOptions.map((t) => (
                      <option key={t.tag_id} value={t.tag_id}>
                        {t.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selProd}
                    required
                    onChange={(e) => {
                      setSelProd(e.target.value);
                      setFormData((s) => ({
                        ...s,
                        product_id: e.target.value,
                      }));
                    }}
                    disabled={!selTag}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm font-bold uppercase tracking-widest text-zinc-700 disabled:opacity-50 disabled:bg-zinc-100"
                  >
                    <option value="">Select Product</option>
                    {prodOptions.map((p) => (
                      <option key={p.product_id} value={p.product_id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-zinc-200 gap-4">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  disabled={isSaving}
                  className="px-6 py-3 border border-zinc-300 text-zinc-700 font-bold uppercase tracking-widest text-xs hover:bg-zinc-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center min-w-[160px] gap-2 px-8 py-3 bg-[#da0e19] hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <FiSave size={16} />
                  )}
                  {isSaving
                    ? editingId
                      ? "Updating..."
                      : "Saving..."
                    : editingId
                      ? "Update"
                      : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 sm:p-6 lg:p-8 w-full font-sans flex flex-col gap-6">
      <div className="bg-white border border-zinc-200 shadow-sm p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
          <FiDownload className="text-[#da0e19] text-xl" />
          <h2 className="text-lg font-black text-zinc-900 uppercase tracking-tight">
            Downloads
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={selCat}
            onChange={(e) => {
              setSelCat(e.target.value);
              setSelSub("");
              setSelTag("");
              setSelProd("");
            }}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm font-bold uppercase tracking-widest text-zinc-700"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.category_id} value={c.category_id}>
                {c.category_name}
              </option>
            ))}
          </select>

          <select
            value={selSub}
            onChange={(e) => {
              setSelSub(e.target.value);
              setSelTag("");
              setSelProd("");
            }}
            disabled={!selCat}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm font-bold uppercase tracking-widest text-zinc-700 disabled:opacity-50 disabled:bg-zinc-100"
          >
            <option value=""> All Subcategories</option>
            {subOptions.map((s) => (
              <option key={s.subcategory_id} value={s.subcategory_id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={selTag}
            onChange={(e) => {
              setSelTag(e.target.value);
              setSelProd("");
            }}
            disabled={!selSub}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm font-bold uppercase tracking-widest text-zinc-700 disabled:opacity-50 disabled:bg-zinc-100"
          >
            <option value="">All Tags</option>
            {tagOptions.map((t) => (
              <option key={t.tag_id} value={t.tag_id}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            value={selProd}
            onChange={(e) => setSelProd(e.target.value)}
            disabled={!selTag}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm font-bold uppercase tracking-widest text-zinc-700 disabled:opacity-50 disabled:bg-zinc-100"
          >
            <option value="">All Products</option>
            {prodOptions.map((p) => (
              <option key={p.product_id} value={p.product_id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 shadow-sm flex flex-col overflow-hidden">
        <div className="px-6 py-4 flex justify-between items-center border-b border-zinc-200 bg-zinc-900">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Download Records
          </h3>
          <div className="flex gap-3">
            {(selCat || selSub || selTag || selProd) && (
              <button
                onClick={() => {
                  setSelCat("");
                  setSelSub("");
                  setSelTag("");
                  setSelProd("");
                }}
                className="flex items-center gap-2 px-4 py-2 border border-zinc-600 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Clear Filters
              </button>
            )}

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2 bg-[#da0e19] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <FiPlus size={16} /> Add Download
            </button>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          {isDownloadsLoading || (selCat && isDetailsLoading) ? (
            <div className="py-20 flex flex-col justify-center items-center text-gray-400">
              <Loader2 className="animate-spin w-8 h-8 mb-4" />
              <span className="text-sm font-medium">Loading Downloads...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-xs font-bold tracking-widest uppercase">
                  <th className="py-4 px-6 w-24">Sr.</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Resource URL</th>
                  <th className="py-4 px-6 text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDownloads.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-12 text-center text-zinc-400 font-bold uppercase tracking-widest text-xs"
                    >
                      No downloads found for this selection.
                    </td>
                  </tr>
                ) : (
                  filteredDownloads.map((d, index) => (
                    <tr
                      key={d.download_id || d.resource_id || index}
                      className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors group"
                    >
                      <td className="py-4 px-6 text-zinc-400 font-mono text-xs">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6 text-zinc-900 font-bold">
                        {d.name}
                      </td>
                      <td className="py-4 px-6 text-zinc-500 text-xs font-bold uppercase">
                        {d.resource_type}
                      </td>
                      <td className="py-4 px-6 text-zinc-500 text-sm truncate max-w-xs">
                        <a
                          href={d.resource_url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-[#da0e19] hover:underline"
                        >
                          {d.resource_url}
                        </a>
                      </td>
                      <td className="py-4 px-6 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(d)}
                          className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(d)}
                          disabled={
                            deleteMutation.isPending ||
                            (typeof deleteResMutation !== "undefined" &&
                              deleteResMutation.isPending)
                          }
                          className="p-2 text-zinc-400 hover:text-[#da0e19] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Download;
