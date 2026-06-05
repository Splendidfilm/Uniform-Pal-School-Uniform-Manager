import{ v2 as cloudinary  } from "cloudinary";

cloudinary.config({
    clod_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }