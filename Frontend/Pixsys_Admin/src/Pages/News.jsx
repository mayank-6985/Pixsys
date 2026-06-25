import React, { useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiImage,
  FiType,
} from "react-icons/fi";
import { useAdminNews, useNewsMutations } from "../hooks/useNews";
import { fetchNewsById } from "../Services/news";

const initialFormState = {
  date: new Date().toISOString().split("T")[0],
  heading: "",
  thumbnail: "",
  content: [{ type: "text", description: "", url: "", caption: "" }],
};

const News = () => {
  const [view, setView] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const { data: newsList = [], isLoading: isListLoading } = useAdminNews();
  const { createMutation, updateMutation, deleteMutation } = useNewsMutations();

  const handleOpenCreate = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setView("form");
  };

  const handleOpenEdit = async (id) => {
    setIsFetchingDetail(true);
    setView("form");
    setEditingId(id);
    try {
      const fullData = await fetchNewsById(id);
      setFormData({
        news_id: fullData.news_id,
        date: fullData.date,
        heading: fullData.heading,
        thumbnail: fullData.thumbnail,
        content: fullData.news_content?.length
          ? fullData.news_content
          : initialFormState.content,
      });
    } catch (error) {
      alert("Failed to fetch news details.");
      setView("list");
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news article?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleBasicChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleContentChange = (index, field, value) => {
    setFormData((prev) => {
      const newContent = prev.content.map((block, i) => {
        if (i !== index) return block;

        const updatedBlock = { ...block, [field]: value };
        if (field === "type") {
          if (value === "text") {
            updatedBlock.url = "";
            updatedBlock.caption = "";
          } else if (value === "image") {
            updatedBlock.description = "";
          }
        }
        return updatedBlock;
      });

      return { ...prev, content: newContent };
    });
  };

  const addContentBlock = () => {
    setFormData((prev) => ({
      ...prev,
      content: [
        ...prev.content,
        { type: "text", description: "", url: "", caption: "" },
      ],
    }));
  };

  const removeContentBlock = (index) => {
    if (formData.content.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedContent = formData.content.map((block) => {
      if (block.type === "text") {
        return {
          type: "text",
          description: block.description || "",
        };
      } else {
        return {
          type: "image",
          url: block.url || "",
          caption: block.caption || "",
        };
      }
    });

    const payload = { ...formData, content: cleanedContent };

    if (editingId) {
      updateMutation.mutate(payload, { onSuccess: () => setView("list") });
    } else {
      createMutation.mutate(payload, { onSuccess: () => setView("list") });
    }
  };
  if (view === "list") {
    return (
      <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
          <div className="px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-900">News Inventory</h1>
            <button
              onClick={handleOpenCreate}
              className="flex justify-center items-center gap-2 px-5 py-2.5 bg-[#da0e19] hover:bg-red-700 text-white rounded-md text-sm font-semibold transition-colors w-full sm:w-auto shadow-sm"
            >
              <FiPlus size={18} /> Add New News
            </button>
          </div>

          <div className="overflow-x-auto w-full">
            {isListLoading ? (
              <div className="text-center py-12 text-gray-500 font-medium">
                Loading records...
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 text-sm font-semibold tracking-wide">
                    <th className="py-4 px-6 w-24">Sr.</th>
                    <th className="py-4 px-6 w-32">Date</th>
                    <th className="py-4 px-6">Heading</th>
                    <th className="py-4 px-6 text-right w-32">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newsList.map((item,index) => (
                    <tr
                      key={item.news_id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                    >
                      <td className="py-4 px-6 text-gray-500 font-mono text-sm">
                        {index+1}
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-sm whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="py-4 px-6 text-gray-900 font-medium">
                        {item.heading}
                      </td>
                      <td className="py-4 px-6 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(item.news_id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.news_id)}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-gray-400 hover:text-[#da0e19] hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {newsList.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-12 text-gray-500"
                      >
                        No news articles found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 w-full">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 sm:px-8 py-5 flex justify-between items-center border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">
            {editingId ? "Edit News Article" : "Create Fresh News"}
          </h1>
          <button
            onClick={() => setView("list")}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <FiX size={22} />
          </button>
        </div>

        {isFetchingDetail ? (
          <div className="p-20 text-center text-gray-500 font-medium">
            Loading article details...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Heading *
                </label>
                <input
                  type="text"
                  name="heading"
                  required
                  maxLength={255}
                  value={formData.heading}
                  onChange={handleBasicChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#da0e19] focus:border-[#da0e19] outline-none transition-all"
                  placeholder="Enter article title"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleBasicChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#da0e19] focus:border-[#da0e19] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Thumbnail URL *
                </label>
                <input
                  type="url"
                  name="thumbnail"
                  required
                  value={formData.thumbnail}
                  onChange={handleBasicChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#da0e19] focus:border-[#da0e19] outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Article Content
                </h2>
              </div>

              <div className="space-y-6">
                {formData.content.map((block, index) => (
                  <div
                    key={index}
                    className="p-5 sm:p-6 border border-gray-200 rounded-lg bg-gray-50 relative"
                  >
                    {formData.content.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContentBlock(index)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-[#da0e19] p-1 rounded transition-colors"
                        title="Remove Block"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                      <div className="lg:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                          Block Type
                        </label>
                        <select
                          value={block.type}
                          onChange={(e) =>
                            handleContentChange(index, "type", e.target.value)
                          }
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#da0e19] focus:border-[#da0e19] outline-none bg-white transition-all text-sm font-medium"
                        >
                          <option value="text">Paragraph Text</option>
                          <option value="image">Media Image</option>
                        </select>
                      </div>
                      <div className="lg:col-span-3 pt-1">
                        {block.type === "text" ? (
                          <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                              <FiType size={14} /> Description
                            </label>
                            <textarea
                              required
                              value={block.description}
                              onChange={(e) =>
                                handleContentChange(
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                              rows="4"
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#da0e19] focus:border-[#da0e19] outline-none resize-y transition-all text-gray-700"
                              placeholder="Write your paragraph here..."
                            ></textarea>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                                <FiImage size={14} /> Image URL
                              </label>
                              <input
                                type="url"
                                required
                                value={block.url}
                                onChange={(e) =>
                                  handleContentChange(
                                    index,
                                    "url",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#da0e19] focus:border-[#da0e19] outline-none transition-all"
                                placeholder="https://..."
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                                Caption
                              </label>
                              <input
                                type="text"
                                required
                                maxLength={100}
                                value={block.caption}
                                onChange={(e) =>
                                  handleContentChange(
                                    index,
                                    "caption",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#da0e19] focus:border-[#da0e19] outline-none transition-all"
                                placeholder="Enter image caption"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addContentBlock}
                className="mt-6 flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-[#da0e19] bg-red-50 hover:bg-red-100 rounded-md transition-colors border border-red-100"
              >
                <FiPlus size={16} /> Add Content Block
              </button>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end pt-6 border-t border-gray-200 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setView("list")}
                className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-[#da0e19] hover:bg-red-700 text-white font-bold rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
              >
                <FiSave size={18} />{" "}
                {editingId ? "Save Changes" : "Publish News"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default News;
