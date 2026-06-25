import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllNews,
  createNews,
  updateNews,
  deleteNews,
} from "../Services/news";

export const useAdminNews = () => {
  return useQuery({
    queryKey: ["adminNews"],
    queryFn: fetchAllNews,
  });
};

export const useNewsMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["adminNews"] });

  const createMutation = useMutation({
    mutationFn: createNews,
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: updateNews,
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteNews,
    onSuccess: invalidate,
  });

  return { createMutation, updateMutation, deleteMutation };
};
