import React, { useState } from "react";
import { FiSave, FiX, FiPlus, FiTrash2, FiUploadCloud } from "react-icons/fi";

const initialFormState = {
  mainCategory: "",
  subCategory: "",
  series: "",
  productName: "",
  tagline: "",
  description: "",
  images: [],
  specifications: [{ key: "", value: "" }],
  downloads: [{ title: "", fileUrl: "" }]
};

export default function AdminProductManager() {
  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Dynamic Array Handlers ---
  const handleArrayChange = (index, field, value, arrayName) => {
    const newArray = [...formData[arrayName]];
    newArray[index][field] = value;
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const addArrayItem = (arrayName, defaultObj) => {
    setFormData({ ...formData, [arrayName]: [...formData[arrayName], defaultObj] });
  };

  const removeArrayItem = (index, arrayName) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving Product Data:", formData);
    // Submit logic here
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] p-4 sm:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-sm text-gray-500 mt-1">Configure hierarchy, overview, and technical specifications.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 shadow-sm">
              <FiX size={18} /> Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-sm"
            >
              <FiSave size={18} /> Save Product
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Classification & Basic Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Classification Card (NOW FULLY DYNAMIC) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-5">
                <h2 className="text-lg font-bold text-blue-900">1. Product Hierarchy</h2>
                <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded">Type new or select existing</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Main Category</label>
                  <input 
                    list="main-categories"
                    name="mainCategory" 
                    value={formData.mainCategory} 
                    onChange={handleInputChange}
                    placeholder="e.g. Control Technology"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white shadow-sm"
                  />
                  {/* These act as suggestions, but don't prevent new entries */}
                  <datalist id="main-categories">
                    <option value="Control Technology" />
                    <option value="HMI" />
                    <option value="Servo Drive" />
                  </datalist>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sub Category</label>
                  <input 
                    list="sub-categories"
                    name="subCategory" 
                    value={formData.subCategory} 
                    onChange={handleInputChange}
                    placeholder="e.g. PAC/IPC"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white shadow-sm"
                  />
                  <datalist id="sub-categories">
                    <option value="PAC/IPC" />
                    <option value="PLC" />
                    <option value="IO" />
                  </datalist>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Series Group</label>
                  <input 
                    list="series-groups"
                    name="series" 
                    value={formData.series} 
                    onChange={handleInputChange}
                    placeholder="e.g. Q series"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white shadow-sm"
                  />
                  <datalist id="series-groups">
                    <option value="Q series" />
                    <option value="M series" />
                    <option value="V100 series" />
                  </datalist>
                </div>
              </div>
            </div>

            {/* Basic Information Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-blue-900 mb-5 border-b border-gray-100 pb-3">2. Overview Content</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                  <input 
                    type="text" 
                    name="productName" 
                    value={formData.productName} 
                    onChange={handleInputChange}
                    placeholder="e.g. Q Plus Series"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Highlight / Tagline</label>
                  <input 
                    type="text" 
                    name="tagline" 
                    value={formData.tagline} 
                    onChange={handleInputChange}
                    placeholder="Enter the custom tagline for this specific product..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange}
                    rows="6"
                    placeholder="Write the full overview description here..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white shadow-sm resize-y"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Media, Specs & Downloads */}
          <div className="space-y-8">
            
            {/* Media Upload */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-blue-900 mb-5 border-b border-gray-100 pb-3">Product Imagery</h2>
              <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors">
                <FiUploadCloud className="mx-auto text-blue-400 mb-3" size={32} />
                <p className="text-sm font-semibold text-blue-800">Click to upload images</p>
                <p className="text-xs text-blue-500 mt-1">Supports JPG, PNG (Max 5MB)</p>
              </div>
            </div>

            {/* Specifications Builder */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-blue-900 mb-5 border-b border-gray-100 pb-3">Specifications</h2>
              <div className="space-y-3">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="grid grid-cols-2 gap-2 flex-1">
                      <input 
                        type="text" 
                        placeholder="Key (e.g. CPU)" 
                        value={spec.key}
                        onChange={(e) => handleArrayChange(index, 'key', e.target.value, 'specifications')}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white shadow-sm"
                      />
                      <input 
                        type="text" 
                        placeholder="Value (e.g. Quad-core)" 
                        value={spec.value}
                        onChange={(e) => handleArrayChange(index, 'value', e.target.value, 'specifications')}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white shadow-sm"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeArrayItem(index, 'specifications')}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addArrayItem('specifications', { key: "", value: "" })}
                  className="w-full py-2.5 mt-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FiPlus /> Add Spec Row
                </button>
              </div>
            </div>

            {/* Downloads Builder */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-blue-900 mb-5 border-b border-gray-100 pb-3">Downloads / Manuals</h2>
              <div className="space-y-4">
                {formData.downloads.map((doc, index) => (
                  <div key={index} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="space-y-2 flex-1">
                      <input 
                        type="text" 
                        placeholder="Document Title" 
                        value={doc.title}
                        onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'downloads')}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white shadow-sm"
                      />
                      <input 
                        type="url" 
                        placeholder="PDF File URL" 
                        value={doc.fileUrl}
                        onChange={(e) => handleArrayChange(index, 'fileUrl', e.target.value, 'downloads')}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white shadow-sm"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeArrayItem(index, 'downloads')}
                      className="p-2 text-gray-400 hover:text-red-500 mt-1 transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addArrayItem('downloads', { title: "", fileUrl: "" })}
                  className="w-full py-2.5 text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FiPlus /> Add File Link
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}