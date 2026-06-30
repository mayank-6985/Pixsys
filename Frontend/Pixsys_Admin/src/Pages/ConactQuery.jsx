import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { usequery } from "../hooks/usequery";

const ContactQuery = () => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const { data, isLoading, isError } = usequery();
  const queries = data?.submissions || [];
  return (
    <>
      <div className="p-4 sm:p-6 w-full h-full overflow-auto bg-[#f4f6f9]">
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div className="flex bg-gray-100 p-1 rounded-md w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-white text-[#da121a] text-xs font-bold tracking-wider rounded border border-gray-200 shadow-sm text-center">
                QUERIES
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col justify-center items-center text-gray-400">
              <Loader2 className="animate-spin w-8 h-8 mb-4" />
              <span className="text-sm font-medium">Loading queries...</span>
            </div>
          ) : isError ? (
            <div className="py-20 text-center text-red-500 font-medium">
              Failed to load queries. Please try again.
            </div>
          ) : queries.length === 0 ? (
            <div className="py-20 text-center text-gray-400 font-medium">
              No queries found.
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
                      Full Name
                    </th>
                    <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">
                      Product of Interest
                    </th>
                    <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {queries.map((row, index) => (
                    <tr
                      key={row.form_id}
                      className="group hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 sm:py-5 border-b border-gray-100 text-sm text-gray-400 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="py-4 sm:py-5 border-b border-gray-100 text-sm font-bold text-gray-800 whitespace-nowrap">
                        {row.full_name}
                      </td>
                      <td className="py-4 sm:py-5 border-b border-gray-100 text-sm text-gray-500 whitespace-nowrap">
                        {row.product_of_interest}
                      </td>
                      <td className="py-4 sm:py-5 border-b border-gray-100 text-sm text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedSubmission({...row,index})}
                          className="text-[#da121a] hover:text-red-800 font-medium text-xs uppercase tracking-wider"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 sm:p-6 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center">
                Query Details
                <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded ml-3">
                  {selectedSubmission.index+1}
                </span>
              </h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-gray-700 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 overflow-y-auto">
              <DetailItem
                label="Full Name"
                value={selectedSubmission.full_name}
              />
              <DetailItem
                label="Email Address"
                value={selectedSubmission.email_address}
              />
              <DetailItem
                label="Phone Number"
                value={selectedSubmission.phone_number}
              />
              <DetailItem
                label="Industry"
                value={selectedSubmission.industry}
              />
              <DetailItem
                label="Product of Interest"
                value={selectedSubmission.product_of_interest}
              />
              <DetailItem label="POUL" value={selectedSubmission.poul} />

              <div className="col-span-1 sm:col-span-2 mt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Description
                </p>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 sm:p-4 rounded-md border border-gray-100 whitespace-pre-wrap leading-relaxed">
                  {selectedSubmission.description || (
                    <span className="italic text-gray-400">
                      No description provided.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="w-full sm:w-auto bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded text-sm font-medium transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
      {label}
    </p>
    <p className="text-sm text-gray-800 font-medium break-words" title={value}>
      {value || "—"}
    </p>
  </div>
);

export default ContactQuery;
