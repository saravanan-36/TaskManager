// utils/uploadImage.js
import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile); // Must match backend field name: 'image'

    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE, // should be '/api/upload-image'
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Assuming backend returns: { imageUrl: 'http://localhost:8000/uploads/filename.jpg' }
    return response.data.imageUrl || response.data;
  } catch (error) {
    console.error("Error uploading image:", error?.response?.data || error.message);
    throw error;
  }
};

export default uploadImage;
