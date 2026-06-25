import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllProductsData,
  fetchCategoryDetails,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  createTag,
  updateTag,
  deleteTag,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../Services/products";

export const useAdminProductsData = () => {
  return useQuery({
    queryKey: ["adminProducts"],
    queryFn: fetchAllProductsData,
  });
};

export const useCategoryDetails = (categoryId) => {
  return useQuery({
    queryKey: ["categoryDetails", categoryId],
    queryFn: () => fetchCategoryDetails(categoryId),
    enabled: !!categoryId,
  });
};

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["adminProducts"] });

  return {
    createCat: useMutation({
      mutationFn: createCategory,
      onSuccess: invalidate,
    }),
    updateCat: useMutation({
      mutationFn: updateCategory,
      onSuccess: invalidate,
    }),
    deleteCat: useMutation({
      mutationFn: deleteCategory,
      onSuccess: invalidate,
    }),
  };
};

export const useSubcategoryMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    queryClient.invalidateQueries({ queryKey: ["categoryDetails"] });
  };

  return {
    createSubCat: useMutation({
      mutationFn: createSubcategory,
      onSuccess: invalidate,
    }),
    updateSubCat: useMutation({
      mutationFn: updateSubcategory,
      onSuccess: invalidate,
    }),
    deleteSubCat: useMutation({
      mutationFn: deleteSubcategory,
      onSuccess: invalidate,
    }),
  };
};

export const useTagMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    queryClient.invalidateQueries({ queryKey: ["categoryDetails"] });
  };

  return {
    createTag: useMutation({ mutationFn: createTag, onSuccess: invalidate }),
    updateTag: useMutation({ mutationFn: updateTag, onSuccess: invalidate }),
    deleteTag: useMutation({ mutationFn: deleteTag, onSuccess: invalidate }),
  };
};

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    queryClient.invalidateQueries({ queryKey: ["categoryDetails"] });
  };

  return {
    createProd: useMutation({
      mutationFn: createProduct,
      onSuccess: invalidate,
    }),
    updateProd: useMutation({
      mutationFn: updateProduct,
      onSuccess: invalidate,
    }),
    deleteProd: useMutation({
      mutationFn: deleteProduct,
      onSuccess: invalidate,
    }),
  };
};
