import { useState } from "react";
import { apiService } from "../Services/uploadService";

export const useHomes = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const executeUpload = async (file, currentSliderImages, onSuccess) => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");

      const safeFile = new File([file], cleanFileName, { type: file.type });

      const presignedData = await apiService.getPresignedUrl(
        safeFile.name,
        safeFile.type,
      );

      const uploadUrl = presignedData.upload_url;
      const finalFileUrl = presignedData.file_url;

      if (!uploadUrl || !finalFileUrl) {
        throw new Error("Backend did not return valid upload URLs.");
      }

      await apiService.uploadToS3(uploadUrl, safeFile, setProgress);

      const updatedSliderArray = [...currentSliderImages, finalFileUrl];

      await apiService.updateSliderInDB(updatedSliderArray);

      setIsUploading(false);
      setProgress(100);

      if (onSuccess) onSuccess(updatedSliderArray);
    } catch (err) {
      console.error("Upload process failed:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to upload image.",
      );
      setIsUploading(false);
      throw err;
    }
  };
  return {
    executeUpload,
    isUploading,
    progress,
    error,
    resetState: () => {
      setProgress(0);
      setError(null);
    },
  };
};
