import React, { useState, useRef, useEffect } from "react";
import { useHomes } from "../hooks/useHomes";
import { apiService } from "../Services/uploadService";
import { FiTrash2 } from "react-icons/fi";
import { Loader2 } from "lucide-react";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [sliderImages, setSliderImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef(null);
  const { executeUpload, isUploading, progress, error, resetState } =
    useHomes();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await apiService.getSliderImages();
        setSliderImages(data || []);
      } catch (err) {
        alert(
          "Something went wrong while loading the slider images. Please try again.",
        );
      } finally {
        setIsLoadingImages(false);
      }
    };
    fetchImages();
  }, []);

  const handleFileSelect = (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    resetState();
  };

  const onUploadClick = async () => {
    try {
      await executeUpload(selectedFile, sliderImages, (newUpdatedArray) => {
        setSliderImages(newUpdatedArray);
        cancelSelection();
      });
    } catch (err) {}
  };

  const cancelSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    resetState();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteImage = async (indexToRemove) => {
    if (sliderImages.length <= 1) {
      alert("Warning: The slider must contain at least one image.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to remove this image from the slider?",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const updatedImages = sliderImages.filter((_, i) => i !== indexToRemove);
      await apiService.updateSliderInDB(updatedImages);
      setSliderImages(updatedImages);
    } catch (err) {
      alert(
        "Something went wrong while trying to delete this item. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 sm:p-6 lg:p-8 w-full font-sans flex flex-col gap-6">
      <div className="bg-white border border-zinc-200 shadow-sm p-6 flex flex-col gap-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
          <svg
            className="w-6 h-6 text-[#da0e19]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          <h2 className="text-lg font-black text-zinc-900 uppercase tracking-tight">
            Home Page Slider Controls
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4">
              Add New Picture
            </h3>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (!isUploading) handleFileSelect(e.dataTransfer.files[0]);
              }}
              onClick={() =>
                !selectedFile && !isUploading && fileInputRef.current?.click()
              }
              className={`border-2 border-dashed p-8 text-center transition-all ${
                selectedFile
                  ? "border-red-200 bg-red-50/50"
                  : "border-zinc-300 hover:border-[#da0e19] cursor-pointer bg-zinc-50"
              } ${isUploading ? "opacity-60 cursor-not-allowed pointer-events-none" : ""}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files[0])}
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
                disabled={isUploading}
              />

              {!selectedFile ? (
                <div className="flex flex-col items-center">
                  <svg
                    className="w-10 h-10 text-[#da0e19] mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm font-bold text-zinc-700 uppercase tracking-widest">
                    Click or drag image here
                  </p>
                  <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest">
                    JPG, PNG, WEBP
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-48 mx-auto border border-zinc-200 shadow-sm object-contain"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-[#da0e19] text-[#da0e19] text-sm font-medium rounded-r-md">
                Something went wrong while processing your request. Please try
                again.
              </div>
            )}

            {isUploading && (
              <div className="mt-4 p-4 border border-zinc-200 bg-zinc-50">
                <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  <span>Uploading to S3...</span>
                  <span className="text-[#da0e19]">{progress}%</span>
                </div>
                <div className="w-full bg-zinc-200 h-1.5">
                  <div
                    className="bg-[#da0e19] h-1.5 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {selectedFile && (
              <div className="mt-6 flex gap-3 border-t border-zinc-100 pt-6">
                <button
                  onClick={cancelSelection}
                  disabled={isUploading}
                  className="flex-1 px-4 py-3 border border-zinc-300 text-zinc-700 font-bold uppercase tracking-widest text-xs hover:bg-zinc-50 transition-colors disabled:opacity-50"
                >
                  Clear
                </button>
                <button
                  onClick={onUploadClick}
                  disabled={isUploading}
                  className="flex flex-1 items-center justify-center gap-2 px-4 py-3 bg-[#da0e19] hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  {isUploading ? "Uploading..." : "Upload & Save"}
                </button>
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">
                Active Slider
              </h3>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Total: {sliderImages.length}
              </span>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 p-4 min-h-[300px]">
              {isLoadingImages ? (
                <div className="flex items-center justify-center h-full text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Loading Images...
                </div>
              ) : sliderImages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  No images deployed yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {sliderImages.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="relative group border border-zinc-300 bg-white aspect-video overflow-hidden"
                    >
                      <img
                        src={imgUrl}
                        alt={`Slider ${index}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleDeleteImage(index)}
                          disabled={isDeleting || sliderImages.length <= 1}
                          className={`p-3 rounded-full flex items-center justify-center transition-colors ${
                            isDeleting || sliderImages.length <= 1
                              ? "bg-zinc-300 text-zinc-500 cursor-not-allowed opacity-60"
                              : "bg-white text-[#da0e19] hover:bg-[#da0e19] hover:text-white"
                          }`}
                          title={
                            sliderImages.length <= 1
                              ? "Cannot delete the last image"
                              : "Delete Image"
                          }
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
