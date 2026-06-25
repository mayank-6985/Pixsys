import api from "../../api";
export const fetchAllNews = async () => {
  const response = await api.get("news/");
  return response.data;
};

export const fetchNewsById = async (id) => {
  const response = await api.get(`news/${id}`);
  return response.data;
};

export const createNews = async (newsData) => {
  const response = await api.post("news/update/", newsData);
  return response.data;
};

export const updateNews = async (newsData) => {
  const response = await api.put("news/update/", newsData);
  return response.data;
};

export const deleteNews = async (news_id) => {
  const response = await api.delete("news/update/", {
    params: { news_id },
    data: { news_id },
  });
  return response.data;
};
