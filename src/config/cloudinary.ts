export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "random-wheel");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dythcqgs1/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Image upload failed");
  }
};
