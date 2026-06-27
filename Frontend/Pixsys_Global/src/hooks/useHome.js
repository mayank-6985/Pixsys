import { fetchImagesforHome } from "../Services/HomeServices";
import { useQuery } from "@tanstack/react-query";

export const useHome = () => {
  return useQuery({
    queryKey: ["sliderImages"],
    queryFn: fetchImagesforHome,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
