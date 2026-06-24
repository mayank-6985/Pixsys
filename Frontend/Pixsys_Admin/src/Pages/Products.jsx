import React, { useState, useMemo } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";
import { AiFillProduct } from "react-icons/ai";
import {
  useAdminProductsData,
  useCategoryMutations,
  useSubcategoryMutations,
  useTagMutations,
  useProductMutations,
  useCategoryDetails,
} from "../hooks/useProducts";

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
};

const Products = () => {
  const [selCat, setSelCat] = useState("");
  const [selSub, setSelSub] = useState("");
  const [selTag, setSelTag] = useState("");
  const [view, setView] = useState("list");
  const [formType, setFormType] = useState("categories");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({});

  const { data: rawData = [], isLoading } = useAdminProductsData();

  const { data: detailedCategoryData = [], isLoading: isDetailsLoading } =
    useCategoryDetails(selCat);

  const { createCat, updateCat, deleteCat } = useCategoryMutations();
  const { createSubCat, updateSubCat, deleteSubCat } =
    useSubcategoryMutations();
  const { createTag, updateTag, deleteTag } = useTagMutations();
  const { createProd, updateProd, deleteProd } = useProductMutations();

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
    setFormType(activeLevel);

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
        // Fallback to selCat because nested API objects often strip the parent ID
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
      setFormData({
        tag_id: item.tag_id || selTag || "",
        name: item.name || "",
        tagline: item.tagline || "",
        description: item.description || "",
        product_img: item.product_img || "",
      });
    }
    setView("form");
  };

  const handleDelete = (id, type) => {
    if (
      type === "categories" &&
      window.confirm("Delete this category and all its contents?")
    ) {
      deleteCat.mutate(id);
      if (String(selCat) === String(id)) {
        setSelCat("");
        setSelSub("");
        setSelTag("");
      }
    } else if (
      type === "subcategories" &&
      window.confirm("Delete this subcategory?")
    ) {
      deleteSubCat.mutate(id);
      if (String(selSub) === String(id)) {
        setSelSub("");
        setSelTag("");
      }
    } else if (type === "tags" && window.confirm("Delete this tag?")) {
      deleteTag.mutate(id);
      if (String(selTag) === String(id)) setSelTag("");
    } else if (type === "products" && window.confirm("Delete this product?")) {
      deleteProd.mutate(id);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue =
      name.includes("_id") && type !== "text" ? parseInt(value) || "" : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

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
      editingId
        ? updateProd.mutate(
            { product_id: editingId, ...formData },
            { onSuccess: () => setView("list") },
          )
        : createProd.mutate(formData, { onSuccess: () => setView("list") });
    }
  };

  if (view === "form") {
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
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm"
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
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                      Category Image URL *
                    </label>
                    <input
                      type="url"
                      name="category_img"
                      required
                      value={formData.category_img || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm"
                    />
                  </div>
                </>
              )}

              {formType === "subcategories" && (
                <>
                  {/* <div>
                    <label className="block text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                      Parent Category *
                    </label>
                    <select
                      name="category_id"
                      required
                      value={formData.category_id || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm"
                    >
                      <option value="" disabled>
                        Select a Category...
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div> */}
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
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm"
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
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                      Category Image URL *
                    </label>
                    <input
                      type="url"
                      name="category_img"
                      required
                      value={formData.category_img || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm"
                    />
                  </div>
                </>
              )}

              {formType === "tags" && (
                <>
                  {/* <div>
                    <label className="block text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                      Parent Subcategory *
                    </label>
                    <select
                      name="subcategory_id"
                      required
                      value={formData.subcategory_id || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm"
                    >
                      <option value="" disabled>
                        Select a Subcategory...
                      </option>
                      {categories
                        .flatMap((c) => c.subcategories || [])
                        .map((sub) => (
                          <option
                            key={sub.subcategory_id}
                            value={sub.subcategory_id}
                          >
                            {sub.name}
                          </option>
                        ))}
                    </select>
                  </div> */}
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
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm"
                    />
                  </div>
                </>
              )}

              {formType === "products" && (
                <>
                  {/* <div>
                    <label className="block text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                      Parent Tag *
                    </label>
                    <select
                      name="tag_id"
                      required
                      value={formData.tag_id || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm"
                    >
                      <option value="" disabled>
                        Select a Tag...
                      </option>
                      {categories
                        .flatMap((c) => c.subcategories || [])
                        .flatMap((s) => s.tags || [])
                        .map((tag) => (
                          <option key={tag.tag_id} value={tag.tag_id}>
                            {tag.name}
                          </option>
                        ))}
                    </select>
                  </div> */}
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
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm"
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
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm"
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
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                      Product Image URL *
                    </label>
                    <input
                      type="url"
                      name="product_img"
                      required
                      value={formData.product_img || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] outline-none transition-all text-sm"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end pt-6 border-t border-zinc-200 gap-4">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="px-6 py-3 border border-zinc-300 text-zinc-700 font-bold uppercase tracking-widest text-xs hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 bg-[#da0e19] hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs transition-colors"
                >
                  <FiSave size={16} /> {editingId ? "Update" : "Save"}
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
            <div className="text-center py-20 text-zinc-500 font-mono text-xs uppercase tracking-widest">
              Loading Data...
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
                          className="p-2 text-zinc-400 hover:text-[#da0e19] transition-colors"
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
                          className="p-2 text-zinc-400 hover:text-[#da0e19] transition-colors"
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
                          className="p-2 text-zinc-400 hover:text-[#da0e19] transition-colors"
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
                          className="p-2 text-zinc-400 hover:text-[#da0e19] transition-colors"
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
