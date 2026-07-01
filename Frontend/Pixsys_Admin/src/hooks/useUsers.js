import { getUsersData, getDownloadReportLink } from "../Services/usersServices";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsersData,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDownloadReport = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: getDownloadReportLink,
    staleTime: 5 * 60 * 1000,
    enabled: false,
  });
};
