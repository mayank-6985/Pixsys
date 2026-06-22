import api from "/api.js";

export const fetchAllSolutionsData = async () => {
  const response = await api.get("solutions/");
  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post("solutions/update/category", data);
  return response.data;
};

export const updateCategory = async (data) => {
  const response = await api.put("solutions/update/category", data);
  return response.data;
};

export const deleteCategory = async (category_id) => {
  const response = await api.delete("solutions/update/category", {
    params: { category_id },
  });
  return response.data;
};

export const createSolution = async (data) => {
  const response = await api.post("solutions/update/solution", data);
  return response.data;
};

export const updateSolution = async (data) => {
  const response = await api.put("solutions/update/solution", data);
  return response.data;
};

export const deleteSolution = async (solutions_id) => {
  const response = await api.delete("solutions/update/solution", {
    params: { solutions_id },
  });
  return response.data;
};
