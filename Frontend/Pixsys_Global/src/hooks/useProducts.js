import { useQuery } from "@tanstack/react-query";
import { fetchProuctsForHeader } from "../Services/ProductsServices";
import {
  fetchCategories,
  fetchCategoryDetails,
  fetchPerticulerProduct,
} from "../Services/ProductsServices";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProuctsForHeader,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useProductDetails = (productId) => {
  return useQuery({
    queryKey: ["productDetails", productId],
    queryFn: () => fetchPerticulerProduct(productId),
    enabled: !!productId,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategoryDetails = (categoryId) => {
  return useQuery({
    queryKey: ["categoryDetails", categoryId],
    queryFn: () => fetchCategoryDetails(categoryId),
    enabled: !!categoryId,
  });
};
