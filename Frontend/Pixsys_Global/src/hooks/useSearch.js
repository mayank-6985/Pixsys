import { useQuery } from "@tanstack/react-query";
import { fetchGlobalSearch } from "../Services/SearchServices";

export const useSearchResults = (keyword) => {
  return useQuery({
    queryKey: ["globalSearch", keyword],
    queryFn: () => fetchGlobalSearch(keyword),
    enabled: !!keyword,
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
