import { useQuery } from "@tanstack/react-query";
import { fetchSolutions } from "../Services/SolutionsServices";

export const useSolutions = () => {
  return useQuery({
    queryKey: ["solutions"],
    queryFn: fetchSolutions,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
