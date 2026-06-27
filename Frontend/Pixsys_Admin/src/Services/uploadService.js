import api from "../../api";
import axios from "axios";

export const apiService = {
  getSliderImages: async () => {
    const response = await api.get(`home/`);
    return response.data.slideImages || response.data;
  },

  updateSliderInDB: async (newImagesArray) => {
    const response = await api.post(`home/`, {
      slideImages: newImagesArray,
    });
    return response.data;
  },

  getPresignedUrl: async (fileName, fileType, folderName = "misc") => {
    const response = await api.post(`utils/generate-upload-url/`, {
      file_name: fileName,
      file_type: fileType,
      folder: folderName,
    });
    return response.data;
  },

  uploadToS3: async (uploadUrl, file, onProgress) => {
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentCompleted);
        }
      },
    });
  },
};
