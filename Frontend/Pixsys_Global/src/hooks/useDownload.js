import { fetchAllDownloads } from "../Services/DownloadServices";
import { useQuery } from "@tanstack/react-query";

export const useAllDownloads = () => {
  return useQuery({
    queryKey: ["allDownloads"],
    queryFn: fetchAllDownloads,
    staleTime: 5 * 60 * 1000,
  });
};
