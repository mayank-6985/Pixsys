import React from "react";
import { Loader2 } from "lucide-react";
import { useUsers, useDownloadReport } from "../hooks/useUsers";

const User = () => {
  const { data, isLoading, isError } = useUsers();

  const { refetch: fetchReportLink, isFetching: isDownloading } =
    useDownloadReport();

  const queries = data?.customers || [];

  const handleDownload = async () => {
    const { data: linkUrl, isError } = await fetchReportLink();

    if (!isError && linkUrl) {
      const link = document.createElement("a");
      link.href = linkUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-4 sm:p-6 w-full h-full overflow-auto bg-[#f4f6f9]">
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex bg-gray-100 p-1 rounded-md w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-white text-[#da121a] text-xs font-bold tracking-wider rounded border border-gray-200 shadow-sm text-center">
              Users
            </button>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center justify-center px-4 py-2 bg-[#da121a] text-white text-sm font-medium rounded hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Preparing...
              </>
            ) : (
              "Download Users Report"
            )}
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col justify-center items-center text-gray-400">
            <Loader2 className="animate-spin w-8 h-8 mb-4" />
            <span className="text-sm font-medium">Loading Users...</span>
          </div>
        ) : isError ? (
          <div className="py-20 text-center text-red-500 font-medium">
            Failed to load users. Please try again.
          </div>
        ) : queries.length === 0 ? (
          <div className="py-20 text-center text-gray-400 font-medium">
            No Users found.
          </div>
        ) : (
          <div className="overflow-x-auto w-full -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 w-24">
                    Sr.
                  </th>
                  <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">
                    Email
                  </th>
                  <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">
                    Phone Number
                  </th>
                </tr>
              </thead>
              <tbody>
                {queries.map((row, index) => (
                  <tr
                    key={index}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 sm:py-5 border-b border-gray-100 text-sm text-gray-400 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="py-4 sm:py-5 border-b border-gray-100 text-sm font-bold text-gray-800 whitespace-nowrap">
                      {row.email}
                    </td>
                    <td className="py-4 sm:py-5 border-b border-gray-100 text-sm text-gray-500 whitespace-nowrap">
                      {row.phone_number}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
