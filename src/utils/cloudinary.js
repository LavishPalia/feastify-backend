import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;
  try {
    const fileMetaData = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);
    return fileMetaData;
  } catch (err) {
    fs.unlinkSync(localFilePath);
    console.log(err);
    return null;
  }
};

const deleteFromCloudinary = async (url, resourceType = "image") => {
  if (!url) {
    return null;
  }

  const resourcePublicId = url.split("/").pop().split(".")[0];

  const response = await cloudinary.uploader.destroy(resourcePublicId, {
    resource_type: resourceType,
  });

  console.log("42, deleteFromCloudinaryResponse", response);
};

export { uploadOnCloudinary, deleteFromCloudinary };
