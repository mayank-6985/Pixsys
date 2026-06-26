import { useState } from "react";
import { apiService } from "../services/uploadService"; 

export const useS3Upload = (folderName = "misc") => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFile = async (file) => {
    if (!file) return null;
    
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const safeFile = new File([file], cleanFileName, { type: file.type });

      const presignedData = await apiService.getPresignedUrl(
        safeFile.name,
        safeFile.type,
        folderName
      );

      const uploadUrl = presignedData.upload_url;
      const finalFileUrl = presignedData.file_url;

      if (!uploadUrl || !finalFileUrl) {
        throw new Error("Backend did not return valid upload URLs.");
      }

      await apiService.uploadToS3(uploadUrl, safeFile, setProgress);

      setIsUploading(false);
      setProgress(100);
      
      return finalFileUrl; 
      
    } catch (err) {
      console.error("S3 Upload failed:", err);
      setError(err.response?.data?.message || "Failed to upload file to S3.");
      setIsUploading(false);
      throw err;
    }
  };

  return { uploadFile, isUploading, progress, error };
};