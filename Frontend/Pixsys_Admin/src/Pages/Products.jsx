import React, { useEffect, useState, useMemo } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";
import { AiFillProduct } from "react-icons/ai";
import { Loader2, X } from "lucide-react";
import {
  useAdminProductsData,
  useCategoryMutations,
  useSubcategoryMutations,
  useTagMutations,
  useProductMutations,
  useCategoryDetails,
  useProductDetail,
} from "../hooks/useProducts";

import S3Uploader from "../Components/S3Uploader";

const emptyCategory = {
  category_name: "",
  tagline: "",
  category_img: "",
};
const emptySubcategory = {
  category_id: "",
  name: "",
  description: "",
  category_img: "",
};
const emptyTag = {
  subcategory_id: "",
  name: "",
};
const emptyProduct = {
  tag_id: "",
  name: "",
  tagline: "",
  description: "",
  product_img: "",
  specifications: [""],
  downloads: [{ resource_type: "CATALOG", name: "", resource_url: "" }],
};

const normalizeDownloadsForForm = (downloads) => {
  if (Array.isArray(downloads) && downloads.length) return downloads;
  if (downloads && typeof downloads === "object") {
    const flattened = [];
    Object.entries(downloads).forEach(([resource_type, items]) => {
      if (!Array.isArray(items)) return;
      items.forEach((item) => {
        flattened.push({
          resource_type,
          name: item?.name || "",
          resource_url: item?.resource_url || item?.resourceUrl || "",
          ...(item?.download_id ? { download_id: item.download_id } : {}),
        });
      });
    });
    if (flattened.length) return flattened;
  }
  return [{ resource_type: "CATALOG", name: "", resource_url: "" }];
};

const groupDownloadsForPayload = (downloads) => {
  return (downloads || []).reduce((acc, dl) => {
    if (!dl || !dl.resource_type || !dl.name || !dl.resource_url) return acc;
    const item = {
      name: dl.name,
      resource_url: dl.resource_url,
      ...(dl.download_id ? { download_id: dl.download_id } : {}),
    };
    acc[dl.resource_type] = [...(acc[dl.resource_type] || []), item];
    return acc;
  }, {});
};

const Products = () => {
  const [selCat, setSelCat] = useState("");
  const [selSub, setSelSub] = useState("");
  const [selTag, setSelTag] = useState("");
  const [view, setView] = useState("list");
  const [formType, setFormType] = useState("categories");
  const [editingId, setEditingId] = useState(null);
  const [productEditId, setProductEditId] = useState(null);

  const [formData, setFormData] = useState({});

  const { data: rawData = [], isLoading } = useAdminProductsData();
  const { data: productDetail, isLoading: isProductDetailLoading } =
    useProductDetail(productEditId);

  const { data: detailedCategoryData = [], isLoading: isDetailsLoading } =
    useCategoryDetails(selCat);

  const { createCat, updateCat, deleteCat } = useCategoryMutations();
  const { createSubCat, updateSubCat, deleteSubCat } =
    useSubcategoryMutations();
  const { createTag, updateTag, deleteTag } = useTagMutations();
  const { createProd, updateProd, deleteProd } = useProductMutations();

  const isSaving =
    createCat.isPending ||
    updateCat.isPending ||
    createSubCat.isPending ||
    updateSubCat.isPending ||
    createTag.isPending ||
    updateTag.isPending ||
    createProd.isPending ||
    updateProd.isPending;

  const hasError =
    createCat.isError ||
    updateCat.isError ||
    createSubCat.isError ||
    updateSubCat.isError ||
    createTag.isError ||
    updateTag.isError ||
    createProd.isError ||
    updateProd.isError;

  const resetAllMutations = () => {
    createCat.reset();
    updateCat.reset();
    createSubCat.reset();
    updateSubCat.reset();
    createTag.reset();
    updateTag.reset();
    createProd.reset();
    updateProd.reset();
  };

  const categories = useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    if (rawData?.data && Array.isArray(rawData.data)) return rawData.data;
    return [];
  }, [rawData]);

  const subcategories = useMemo(() => {
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
      subcategories.find((s) => String(s.subcategory_id) === String(selSub)) ||
      null
    );
  }, [subcategories, selSub]);

  const tags = useMemo(() => {
    return currentSubcategory?.tags || [];
  }, [currentSubcategory]);

  const currentTag = useMemo(() => {
    if (!selTag) return null;
    return tags.find((t) => String(t.tag_id) === String(selTag)) || null;
  }, [tags, selTag]);

  const products = useMemo(() => {
    return currentTag?.products || [];
  }, [currentTag]);

  const activeLevel = useMemo(() => {
    if (selTag) return "products";
    if (selSub) return "tags";
    if (selCat) return "subcategories";
    return "categories";
  }, [selCat, selSub, selTag]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setProductEditId(null);
    setFormType(activeLevel);
    resetAllMutations();

    if (activeLevel === "categories") {
      setFormData(emptyCategory);
    } else if (activeLevel === "subcategories") {
      setFormData({ ...emptySubcategory, category_id: selCat });
    } else if (activeLevel === "tags") {
      setFormData({ ...emptyTag, subcategory_id: selSub });
    } else if (activeLevel === "products") {
      setFormData({ ...emptyProduct, tag_id: selTag });
    }
    setView("form");
  };

  const handleOpenEdit = (item, type) => {
    setFormType(type);
    resetAllMutations();

    if (type === "categories") {
      setEditingId(item.category_id);
      setFormData({
        category_name: item.category_name || "",
        tagline: item.tagline || item.original?.tagline || "",
        category_img: item.category_img || item.original?.category_img || "",
      });
    } else if (type === "subcategories") {
      setEditingId(item.subcategory_id);
      setFormData({
        category_id: item.category_id || selCat || "",
        name: item.name || "",
        description: item.description || item.original?.description || "",
        category_img: item.category_img || item.original?.category_img || "",
      });
    } else if (type === "tags") {
      setEditingId(item.tag_id);
      setFormData({
        subcategory_id: item.subcategory_id || selSub || "",
        name: item.name || "",
      });
    } else if (type === "products") {
      setEditingId(item.product_id);
      setProductEditId(item.product_id);
      setFormData({ ...emptyProduct, tag_id: item.tag_id || selTag || "" });
    }
    setView("form");
  };

  const handleDelete = (id, type) => {
    const errorMsg =
      "Something went wrong while trying to delete this item. Please try again.";

    if (
      type === "categories" &&
      window.confirm("Delete this category and all its contents?")
    ) {
      deleteCat.mutate(id, { onError: () => alert(errorMsg) });
      if (String(selCat) === String(id)) {
        setSelCat("");
        setSelSub("");
        setSelTag("");
      }
    } else if (
      type === "subcategories" &&
      window.confirm("Delete this subcategory?")
    ) {
      deleteSubCat.mutate(id, { onError: () => alert(errorMsg) });
      if (String(selSub) === String(id)) {
        setSelSub("");
        setSelTag("");
      }
    } else if (type === "tags" && window.confirm("Delete this tag?")) {
      deleteTag.mutate(id, { onError: () => alert(errorMsg) });
      if (String(selTag) === String(id)) setSelTag("");
    } else if (type === "products" && window.confirm("Delete this product?")) {
      deleteProd.mutate(id, { onError: () => alert(errorMsg) });
    }
  };

  const handleSpecChange = (index, value) => {
    const newSpecs = [...(formData.specifications || [])];
    newSpecs[index] = value;
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };
  const addSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...(prev.specifications || []), ""],
    }));
  };
  const removeSpec = (index) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const handleDownloadChange = (index, field, value) => {
    const newDownloads = [...(formData.downloads || [])];
    newDownloads[index][field] = value;
    setFormData((prev) => ({ ...prev, downloads: newDownloads }));
  };
  const addDownload = () => {
    setFormData((prev) => ({
      ...prev,
      downloads: [
        ...(prev.downloads || []),
        { resource_type: "CATALOG", name: "", resource_url: "" },
      ],
    }));
  };
  const removeDownload = (index) => {
    const newDownloads = formData.downloads.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, downloads: newDownloads }));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue =
      name.includes("_id") && type !== "text" ? parseInt(value) || "" : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  useEffect(() => {
    if (
      formType === "products" &&
      productEditId &&
      productDetail &&
      productDetail.product_id === productEditId
    ) {
      const existingSpecs =
        Array.isArray(productDetail.specifications) &&
        productDetail.specifications.length
          ? productDetail.specifications
          : [""];

      const existingDownloads = normalizeDownloadsForForm(
        productDetail.downloads || productDetail.original?.downloads,
      );

      setFormData({
        tag_id: productDetail.tag_id || selTag || "",
        name: productDetail.name || "",
        tagline: productDetail.tagline || "",
        description: productDetail.description || "",
        product_img: productDetail.product_img || "",
        specifications: existingSpecs,
        downloads: existingDownloads,
      });
    }
  }, [formType, productEditId, productDetail, selTag]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formType === "categories") {
      editingId
        ? updateCat.mutate(
            { category_id: editingId, ...formData },
            { onSuccess: () => setView("list") },
          )
        : createCat.mutate(formData, { onSuccess: () => setView("list") });
    } else if (formType === "subcategories") {
      editingId
        ? updateSubCat.mutate(
            { subcategory_id: editingId, ...formData },
            { onSuccess: () => setView("list") },
          )
        : createSubCat.mutate(formData, { onSuccess: () => setView("list") });
    } else if (formType === "tags") {
      editingId
        ? updateTag.mutate(
            { tag_id: editingId, ...formData },
            { onSuccess: () => setView("list") },
          )
        : createTag.mutate(formData, { onSuccess: () => setView("list") });
    } else if (formType === "products") {
      const cleanedSpecs = (formData.specifications || []).filter(
        (s) => s.trim() !== "",
      );

      const payload = {
        tag_id: formData.tag_id,
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        product_img: formData.product_img,
        specifications: cleanedSpecs,
        downloads: formData.downloads || [],
      };

      editingId
        ? updateProd.mutate(
            { product_id: editingId, ...payload },
            {
              onSuccess: () => {
                setView("list");
                setProductEditId(null);
              },
            },
          )
        : createProd.mutate(payload, {
            onSuccess: () => {
              setView("list");
              setProductEditId(null);
            },
          });
    }
  };

  if (view === "form") {
    if (
      formType === "products" &&
      productEditId &&
      isProductDetailLoading &&
      !productDetail
    ) {
      return (
        <div className="py-20 flex flex-col justify-center items-center text-gray-400">
          <Loader2 className="animate-spin w-8 h-8 mb-4" />
          <span className="text-sm font-medium">
            {" "}
            Loading product details...
          </span>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#f8f9fa] p-4 sm:p-6 lg:p-8 w-full font-sans">
        <div className="max-w-3xl mx-auto bg-white border border-zinc-200 shadow-xl overflow-hidden">
          <div className="px-8 py-6 flex justify-between items-center border-b border-zinc-200 bg-zinc-900 text-white">
            <h1 className="text-lg font-bold uppercase tracking-widest">
              {editingId
                ? `Edit ${formType.slice(0, -1)}`
                : `Create ${formType.slice(0, -1)}`}
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

              {formType === "categories" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      name="category_name"
                      required
                      value={formData.category_name || ""}
                      onChange={handleChange}
                      disabled={isSaving}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      name="tagline"
                      required
                      value={formData.tagline || ""}
                      onChange={handleChange}
                      disabled={isSaving}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <S3Uploader
                      label="Category Image *"
                      accept="image/jpeg, image/png, image/webp"
                      folder="categories"
                      currentFileUrl={formData.category_img}
                      onUploadSuccess={(url) =>
                        setFormData((prev) => ({ ...prev, category_img: url }))
                      }
                    />
                    <input
                      type="hidden"
                      name="category_img"
                      required
                      value={formData.category_img || ""}
                    />
                  </div>
                </>
              )}

              {formType === "subcategories" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                      Subcategory Name *
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
                      Description *
                    </label>
                    <textarea
                      name="description"
                      required
                      rows="4"
                      value={formData.description || ""}
                      onChange={handleChange}
                      disabled={isSaving}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm resize-none disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <S3Uploader
                      label="Subcategory Image *"
                      accept="image/jpeg, image/png, image/webp"
                      folder="subcategories"
                      currentFileUrl={formData.category_img}
                      onUploadSuccess={(url) =>
                        setFormData((prev) => ({ ...prev, category_img: url }))
                      }
                    />
                    <input
                      type="hidden"
                      name="category_img"
                      required
                      value={formData.category_img || ""}
                    />
                  </div>
                </>
              )}

              {formType === "tags" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                      Tag Name *
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
                </>
              )}

              {formType === "products" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                      Product Name *
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
                      Tagline *
                    </label>
                    <input
                      type="text"
                      name="tagline"
                      required
                      value={formData.tagline || ""}
                      onChange={handleChange}
                      disabled={isSaving}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      required
                      rows="4"
                      value={formData.description || ""}
                      onChange={handleChange}
                      disabled={isSaving}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm resize-none disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <S3Uploader
                      label="Product Image *"
                      accept="image/jpeg, image/png, image/webp"
                      folder="products"
                      currentFileUrl={formData.product_img}
                      onUploadSuccess={(url) =>
                        setFormData((prev) => ({ ...prev, product_img: url }))
                      }
                    />
                    <input
                      type="hidden"
                      name="product_img"
                      required
                      value={formData.product_img || ""}
                    />
                  </div>

                  <div className="pt-4 border-t border-zinc-200">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-xs font-bold text-zinc-900 uppercase tracking-widest">
                        Specifications
                      </label>
                      <button
                        type="button"
                        onClick={addSpec}
                        disabled={isSaving}
                        className="text-xs font-bold text-[#da0e19] uppercase tracking-widest flex items-center gap-1 hover:underline disabled:opacity-50 disabled:no-underline"
                      >
                        <FiPlus /> Add Spec
                      </button>
                    </div>
                    {formData.specifications?.map((spec, index) => (
                      <div key={index} className="flex gap-2 mb-3">
                        <input
                          type="text"
                          required
                          placeholder="e.g. 24V DC Power"
                          value={spec}
                          onChange={(e) =>
                            handleSpecChange(index, e.target.value)
                          }
                          disabled={isSaving}
                          className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] outline-none transition-all text-sm disabled:opacity-60"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpec(index)}
                          disabled={isSaving}
                          className="px-4 bg-zinc-200 text-zinc-600 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-zinc-200">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-xs font-bold text-zinc-900 uppercase tracking-widest">
                        Downloads
                      </label>
                      <button
                        type="button"
                        onClick={addDownload}
                        disabled={isSaving}
                        className="text-xs font-bold text-[#da0e19] uppercase tracking-widest flex items-center gap-1 hover:underline disabled:opacity-50 disabled:no-underline"
                      >
                        <FiPlus /> Add Download
                      </button>
                    </div>
                    {formData.downloads?.map((dl, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-3 p-4 mb-4 bg-zinc-50 border border-zinc-200 relative"
                      >
                        <button
                          type="button"
                          onClick={() => removeDownload(index)}
                          disabled={isSaving}
                          className="absolute top-2 right-2 text-zinc-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                          <FiX size={18} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                              Type *
                            </label>
                            <select
                              required
                              value={dl.resource_type}
                              onChange={(e) =>
                                handleDownloadChange(
                                  index,
                                  "resource_type",
                                  e.target.value,
                                )
                              }
                              disabled={isSaving}
                              className="w-full px-3 py-2 border border-zinc-300 outline-none text-sm disabled:opacity-60"
                            >
                              <option value="SOFTWARE">SOFTWARE</option>
                              <option value="SOFTWARE_MANUAL">
                                SOFTWARE_MANUAL
                              </option>
                              <option value="CATALOG">CATALOG</option>
                              <option value="DIMENTION">DIMENTION</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                              Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={dl.name}
                              onChange={(e) =>
                                handleDownloadChange(
                                  index,
                                  "name",
                                  e.target.value,
                                )
                              }
                              disabled={isSaving}
                              className="w-full px-3 py-2 border border-zinc-300 outline-none text-sm disabled:opacity-60"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <S3Uploader
                              label={`Upload ${dl.resource_type.replace("_", " ")} File *`}
                              accept={
                                dl.resource_type.includes("SOFTWARE")
                                  ? ".exe,.zip,.rar,.msi"
                                  : ".pdf,image/*"
                              }
                              folder={`products/${dl.resource_type.toLowerCase()}`}
                              currentFileUrl={dl.resource_url}
                              onUploadSuccess={(url) =>
                                handleDownloadChange(index, "resource_url", url)
                              }
                            />
                            <input
                              type="hidden"
                              required
                              value={dl.resource_url || ""}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="flex justify-end pt-6 border-t border-zinc-200 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setView("list");
                    setProductEditId(null);
                  }}
                  disabled={isSaving}
                  className="px-6 py-3 border border-zinc-300 text-zinc-700 font-bold uppercase tracking-widest text-xs hover:bg-zinc-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center min-w-[140px] gap-2 px-8 py-3 bg-[#da0e19] hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
          <AiFillProduct className="text-[#da0e19] text-xl" />
          <h2 className="text-lg font-black text-zinc-900 uppercase tracking-tight">
            Products
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selCat}
            onChange={(e) => {
              setSelCat(e.target.value);
              setSelSub("");
              setSelTag("");
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
            }}
            disabled={!selCat}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm font-bold uppercase tracking-widest text-zinc-700 disabled:opacity-50 disabled:bg-zinc-100"
          >
            <option value=""> All Subcategories</option>
            {subcategories.map((s) => (
              <option key={s.subcategory_id} value={s.subcategory_id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={selTag}
            onChange={(e) => setSelTag(e.target.value)}
            disabled={!selSub}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm font-bold uppercase tracking-widest text-zinc-700 disabled:opacity-50 disabled:bg-zinc-100"
          >
            <option value="">All Tags</option>
            {tags.map((t) => (
              <option key={t.tag_id} value={t.tag_id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 shadow-sm flex flex-col overflow-hidden">
        <div className="px-6 py-4 flex justify-between items-center border-b border-zinc-200 bg-zinc-900">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            {activeLevel} Records
          </h3>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#da0e19] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <FiPlus size={16} /> Add {activeLevel.slice(0, -1)}
          </button>
        </div>

        <div className="overflow-x-auto w-full">
          {isLoading || (selCat && isDetailsLoading) ? (
            <div className="py-20 flex flex-col justify-center items-center text-gray-400">
              <Loader2 className="animate-spin w-8 h-8 mb-4" />
              <span className="text-sm font-medium">Loading Data</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-xs font-bold tracking-widest uppercase">
                  <th className="py-4 px-6 w-24">ID</th>
                  <th className="py-4 px-6">Name</th>
                  {activeLevel === "categories" && (
                    <th className="py-4 px-6">Tagline</th>
                  )}
                  {activeLevel === "subcategories" && (
                    <th className="py-4 px-6">Description</th>
                  )}
                  {activeLevel === "products" && (
                    <th className="py-4 px-6">Tagline</th>
                  )}
                  <th className="py-4 px-6 text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeLevel === "categories" &&
                  categories.map((item) => (
                    <tr
                      key={item.category_id}
                      className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors group"
                    >
                      <td className="py-4 px-6 text-zinc-400 font-mono text-xs">
                        #{String(item.category_id).padStart(4, "0")}
                      </td>
                      <td className="py-4 px-6 text-zinc-900 font-bold">
                        {item.category_name}
                      </td>
                      <td className="py-4 px-6 text-zinc-500 text-sm">
                        {item.tagline}
                      </td>
                      <td className="py-4 px-6 flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item, "categories")}
                          className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(item.category_id, "categories")
                          }
                          disabled={deleteCat.isPending}
                          className="p-2 text-zinc-400 hover:text-[#da0e19] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}

                {activeLevel === "subcategories" &&
                  subcategories.map((item) => (
                    <tr
                      key={item.subcategory_id}
                      className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors group"
                    >
                      <td className="py-4 px-6 text-zinc-400 font-mono text-xs">
                        #{String(item.subcategory_id).padStart(4, "0")}
                      </td>
                      <td className="py-4 px-6 text-zinc-900 font-bold">
                        {item.name}
                      </td>
                      <td className="py-4 px-6 text-zinc-500 text-sm truncate max-w-xs">
                        {item.description}
                      </td>
                      <td className="py-4 px-6 flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item, "subcategories")}
                          className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(item.subcategory_id, "subcategories")
                          }
                          disabled={deleteSubCat.isPending}
                          className="p-2 text-zinc-400 hover:text-[#da0e19] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}

                {activeLevel === "tags" &&
                  tags.map((item) => (
                    <tr
                      key={item.tag_id}
                      className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors group"
                    >
                      <td className="py-4 px-6 text-zinc-400 font-mono text-xs">
                        #{String(item.tag_id).padStart(4, "0")}
                      </td>
                      <td className="py-4 px-6 text-zinc-900 font-bold">
                        {item.name}
                      </td>
                      <td className="py-4 px-6 flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item, "tags")}
                          className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.tag_id, "tags")}
                          disabled={deleteTag.isPending}
                          className="p-2 text-zinc-400 hover:text-[#da0e19] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}

                {activeLevel === "products" &&
                  products.map((item) => (
                    <tr
                      key={item.product_id}
                      className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors group"
                    >
                      <td className="py-4 px-6 text-zinc-400 font-mono text-xs">
                        #{String(item.product_id).padStart(4, "0")}
                      </td>
                      <td className="py-4 px-6 text-zinc-900 font-bold">
                        {item.name}
                      </td>
                      <td className="py-4 px-6 text-zinc-500 text-sm">
                        {item.tagline}
                      </td>
                      <td className="py-4 px-6 flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item, "products")}
                          className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(item.product_id, "products")
                          }
                          disabled={deleteProd.isPending}
                          className="p-2 text-zinc-400 hover:text-[#da0e19] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}

                {((activeLevel === "categories" && categories.length === 0) ||
                  (activeLevel === "subcategories" &&
                    subcategories.length === 0) ||
                  (activeLevel === "tags" && tags.length === 0) ||
                  (activeLevel === "products" && products.length === 0)) &&
                  !isLoading && (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-12 text-center text-zinc-400 font-bold uppercase tracking-widest text-xs"
                      >
                        No data found for this selection.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
