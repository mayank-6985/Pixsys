import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllSolutionsData,
  createCategory,
  updateCategory,
  deleteCategory,
  createSolution,
  updateSolution,
  deleteSolution,
} from "../Services/solutions"

export const useAdminSolutionsData = () => {
  return useQuery({
    queryKey: ["adminSolutions"],
    queryFn: fetchAllSolutionsData,
  });
};

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["adminSolutions"] });

  return {
    createCat: useMutation({ mutationFn: createCategory, onSuccess: invalidate }),
    updateCat: useMutation({ mutationFn: updateCategory, onSuccess: invalidate }),
    deleteCat: useMutation({ mutationFn: deleteCategory, onSuccess: invalidate }),
  };
};

export const useSolutionMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["adminSolutions"] });

  return {
    createSol: useMutation({ mutationFn: createSolution, onSuccess: invalidate }),
    updateSol: useMutation({ mutationFn: updateSolution, onSuccess: invalidate }),
    deleteSol: useMutation({ mutationFn: deleteSolution, onSuccess: invalidate }),
  };
};