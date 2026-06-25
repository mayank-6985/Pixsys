import { useQuery } from "@tanstack/react-query";
import { fetchNewsById } from "../Services/NewsServices"

export const useNewsDetail = (id) => {
  return useQuery({
    queryKey: ["news", id],
    queryFn: () => fetchNewsById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
