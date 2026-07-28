import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllDownloads,
  updateDownload,
  deleteDownload,
  createDownload,
  createResource,
  updateResource,
  deleteResource,
} from "../Services/downloads";

export const useAllDownloads = () => {
  return useQuery({
    queryKey: ["adminDownloads"],
    queryFn: fetchAllDownloads,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateDownload = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateDownload,
    onSuccess: () => qc.invalidateQueries(["adminDownloads"]),
  });
};

export const useDeleteDownload = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteDownload,
    onSuccess: () => qc.invalidateQueries(["adminDownloads"]),
  });
};

export const useCreateDownload = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createDownload,
    onSuccess: () => qc.invalidateQueries(["adminDownloads"]),
  });
};

export const useCreateResource = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createResource,
    onSuccess: () => qc.invalidateQueries(["adminDownloads"]),
  });
};

export const useUpdateResource = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateResource,
    onSuccess: () => qc.invalidateQueries(["adminDownloads"]),
  });
};

export const useDeleteResource = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteResource,
    onSuccess: () => qc.invalidateQueries(["adminDownloads"]),
  });
};
