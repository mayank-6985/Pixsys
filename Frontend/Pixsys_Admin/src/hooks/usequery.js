import { fetchQueryData } from "../Services/contactQuery";
import { useQuery } from "@tanstack/react-query";

export const usequery = () => {
  return useQuery({
    queryKey: ["query"],
    queryFn: fetchQueryData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
