import React, { useState, useMemo } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";
import { useAdminSolutionsData, useCategoryMutations, useSolutionMutations } from "../hooks/useSolutions";

const emptyCategory = { category_name: "", thumbnail: "" };
const emptySolution = { category_id: "", title: "", thumbnail: "", videoUrl: "" };

const Solutions = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [view, setView] = useState("list");
  const [editingId, setEditingId] = useState(null);
  
  const [catFormData, setCatFormData] = useState(emptyCategory);
  const [solFormData, setSolFormData] = useState(emptySolution);

  const { data: rawData = [], isLoading } = useAdminSolutionsData();
  const { createCat, updateCat, deleteCat } = useCategoryMutations();
  const { createSol, updateSol, deleteSol } = useSolutionMutations();

  const categoriesList = useMemo(() => {
    if (!Array.isArray(rawData)) return [];
    return rawData.map(cat => ({
      category_id: cat.category_id,
      category_name: cat.category_name,
      thumbnail: cat.thumbnail,
      solutionCount: cat.solutions?.length || 0
    }));
  }, [rawData]);

  const solutionsList = useMemo(() => {
    if (!Array.isArray(rawData)) return [];
    return rawData.flatMap(cat => 
      (cat.solutions || []).map(sol => ({
        ...sol,
        category_name: cat.category_name,
        category_id: cat.category_id
      }))
    );
  }, [rawData]);

  const handleOpenCreate = () => {
    setEditingId(null);
    if (activeTab === "categories") {
      setCatFormData(emptyCategory);
    } else {
      setSolFormData(emptySolution);
    }
    setView("form");
  };

  const handleOpenEditCat = (cat) => {
    setEditingId(cat.category_id);
    setCatFormData({
      category_name: cat.category_name,
      thumbnail: cat.thumbnail
    });
    setView("form");
  };

  const handleOpenEditSol = (sol) => {
    setEditingId(sol.solutions_id);
    setSolFormData({
      category_id: sol.category_id,
      title: sol.title,
      thumbnail: sol.thumbnail,
      videoUrl: sol.videoUrl
    });
    setView("form");
  };

  const handleDeleteCat = (id) => {
    if (window.confirm("Delete this category AND all its solutions?")) {
      deleteCat.mutate(id);
    }
  };

  const handleDeleteSol = (id) => {
    if (window.confirm("Delete this solution?")) {
      deleteSol.mutate(id);
    }
  };

  const handleCatChange = (e) => {
    setCatFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSolChange = (e) => {
    const value = e.target.name === "category_id" ? parseInt(e.target.value) : e.target.value;
    setSolFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleCatSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateCat.mutate({ category_id: editingId, ...catFormData }, { onSuccess: () => setView("list") });
    } else {
      createCat.mutate(catFormData, { onSuccess: () => setView("list") });
    }
  };

  const handleSolSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateSol.mutate({ solutions_id: editingId, ...solFormData }, { onSuccess: () => setView("list") });
    } else {
      createSol.mutate(solFormData, { onSuccess: () => setView("list") });
    }
  };

  if (view === "form") {
    return (
      <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 w-full">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 sm:px-8 py-5 flex justify-between items-center border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-900">
              {editingId ? `Edit ${activeTab === "categories" ? "Category" : "Solution"}` : `Create ${activeTab === "categories" ? "Category" : "Solution"}`}
            </h1>
            <button onClick={() => setView("list")} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              <FiX size={22} />
            </button>
          </div>

          {activeTab === "categories" ? (
            <form onSubmit={handleCatSubmit} className="p-6 sm:p-8">
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category Name *</label>
                  <input type="text" name="category_name" required value={catFormData.category_name} onChange={handleCatChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#da0e19] focus:border-[#da0e19] outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Thumbnail URL *</label>
                  <input type="url" name="thumbnail" required value={catFormData.thumbnail} onChange={handleCatChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#da0e19] focus:border-[#da0e19] outline-none transition-all" />
                </div>
              </div>
              <div className="flex justify-end pt-6 border-t border-gray-200 gap-4">
                <button type="button" onClick={() => setView("list")} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={createCat.isPending || updateCat.isPending} className="flex items-center gap-2 px-8 py-2.5 bg-[#da0e19] hover:bg-red-700 text-white font-bold rounded-md transition-colors disabled:opacity-70">
                  <FiSave size={18} /> {editingId ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSolSubmit} className="p-6 sm:p-8">
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Assign to Category *</label>
                  <select name="category_id" required value={solFormData.category_id} onChange={handleSolChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#da0e19] focus:border-[#da0e19] outline-none transition-all bg-white">
                    <option value="" disabled>Select a Category...</option>
                    {categoriesList.map(cat => (
                      <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Solution Title *</label>
                  <input type="text" name="title" required maxLength={100} value={solFormData.title} onChange={handleSolChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#da0e19] focus:border-[#da0e19] outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Thumbnail URL *</label>
                  <input type="url" name="thumbnail" required value={solFormData.thumbnail} onChange={handleSolChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#da0e19] focus:border-[#da0e19] outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Video URL *</label>
                  <input type="url" name="videoUrl" required value={solFormData.videoUrl} onChange={handleSolChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#da0e19] focus:border-[#da0e19] outline-none transition-all" />
                </div>
              </div>
              <div className="flex justify-end pt-6 border-t border-gray-200 gap-4">
                <button type="button" onClick={() => setView("list")} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={createSol.isPending || updateSol.isPending} className="flex items-center gap-2 px-8 py-2.5 bg-[#da0e19] hover:bg-red-700 text-white font-bold rounded-md transition-colors disabled:opacity-70">
                  <FiSave size={18} /> {editingId ? "Save Changes" : "Create Solution"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
        
        <div className="px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === "categories" ? "bg-white text-[#da0e19] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab("solutions")}
              className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === "solutions" ? "bg-white text-[#da0e19] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Solutions
            </button>
          </div>
          <button onClick={handleOpenCreate} className="flex justify-center items-center gap-2 px-5 py-2.5 bg-[#da0e19] hover:bg-red-700 text-white rounded-md text-sm font-semibold transition-colors w-full sm:w-auto shadow-sm">
            <FiPlus size={18} /> Add New {activeTab === "categories" ? "Category" : "Solution"}
          </button>
        </div>

        <div className="overflow-x-auto w-full">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500 font-medium">Loading records...</div>
          ) : activeTab === "categories" ? (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 text-sm font-semibold tracking-wide">
                  <th className="py-4 px-6 w-24">Cat ID</th>
                  <th className="py-4 px-6">Category Name</th>
                  <th className="py-4 px-6 w-32 text-center">Solutions</th>
                  <th className="py-4 px-6 text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categoriesList.map((item) => (
                  <tr key={item.category_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-6 text-gray-500 font-mono text-sm">#{item.category_id}</td>
                    <td className="py-4 px-6 text-gray-900 font-medium">{item.category_name}</td>
                    <td className="py-4 px-6 text-gray-500 text-sm text-center">{item.solutionCount}</td>
                    <td className="py-4 px-6 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenEditCat(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><FiEdit2 size={18} /></button>
                      <button onClick={() => handleDeleteCat(item.category_id)} disabled={deleteCat.isPending} className="p-2 text-gray-400 hover:text-[#da0e19] hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"><FiTrash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 text-sm font-semibold tracking-wide">
                  <th className="py-4 px-6 w-24">Sol ID</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6 text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {solutionsList.map((item) => (
                  <tr key={item.solutions_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-6 text-gray-500 font-mono text-sm">#{item.solutions_id}</td>
                    <td className="py-4 px-6 text-gray-500 text-sm"><span className="px-2 py-1 bg-gray-100 rounded-md">{item.category_name}</span></td>
                    <td className="py-4 px-6 text-gray-900 font-medium">{item.title}</td>
                    <td className="py-4 px-6 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenEditSol(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><FiEdit2 size={18} /></button>
                      <button onClick={() => handleDeleteSol(item.solutions_id)} disabled={deleteSol.isPending} className="p-2 text-gray-400 hover:text-[#da0e19] hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"><FiTrash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Solutions;