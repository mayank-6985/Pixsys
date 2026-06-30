import api from "/api.js";
export const fetchAllProductsData = async () => {
  const response = await api.get("products/categories/");
  return response.data;
};

export const fetchCategoryDetails = async (categoryId) => {
  const response = await api.get(`products/categories/${categoryId}`);
  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post("products/categories/", data);
  return response.data;
};

export const updateCategory = async (data) => {
  const response = await api.put("products/categories/", data);
  return response.data;
};

export const deleteCategory = async (category_id) => {
  const response = await api.delete("products/categories/", {
    params: { category_id },
  });
  return response.data;
};

export const createSubcategory = async (data) => {
  const response = await api.post("products/subcategories/", data);
  return response.data;
};

export const updateSubcategory = async (data) => {
  const response = await api.put("products/subcategories/", data);
  return response.data;
};

export const deleteSubcategory = async (subcategory_id) => {
  const response = await api.delete("products/subcategories/", {
    params: { subcategory_id },
  });
  return response.data;
};

export const createTag = async (data) => {
  const response = await api.post("products/tags/", data);
  return response.data;
};

export const updateTag = async (data) => {
  const response = await api.put("products/tags/", data);
  return response.data;
};

export const deleteTag = async (tag_id) => {
  const response = await api.delete("products/tags/", {
    params: { tag_id },
  });
  return response.data;
};

export const createProduct = async (data) => {
  const response = await api.post("products/products/", data);
  return response.data;
};

export const updateProduct = async (data) => {
  const response = await api.put("products/products/", data);
  return response.data;
};

export const fetchProductDetails = async (product_id) => {
  const response = await api.get(`products/products/${product_id}`);
  return response.data;
};

export const deleteProduct = async (product_id) => {
  const response = await api.delete("products/products/", {
    params: { product_id },
  });
  return response.data;
};
