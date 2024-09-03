// import { v2 as cloudinary } from "cloudinary";

// (async function () {
//   // Configuration
//   cloudinary.config({
//     cloud_name: "dhpjjryem",
//     api_key: "641966228929714",
//     api_secret: "<your_api_secret>", // Click 'View API Keys' above to copy your API secret
//   });

//   // Upload an image
//   const uploadResult = await cloudinary.uploader
//     .upload(
//       "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
//       {
//         public_id: "shoes",
//       }
//     )
//     .catch((error) => {
//       console.log(error);
//     });

//   console.log(uploadResult);

//   // Optimize delivery by resizing and applying auto-format and auto-quality
//   const optimizeUrl = cloudinary.url("shoes", {
//     fetch_format: "auto",
//     quality: "auto",
//   });

//   console.log(optimizeUrl);

//   // Transform the image: auto-crop to square aspect_ratio
//   const autoCropUrl = cloudinary.url("shoes", {
//     crop: "auto",
//     gravity: "auto",
//     width: 500,
//     height: 500,
//   });

//   console.log(autoCropUrl);
// })();


import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
    });




const uploadOnCloudinary = () => async (localfilepath) => {
   try {
      if(!localfilepath) return null;
      const response = await cloudinary.uploader.upload(localfilepath, {resource_type: "auto"})
      console.log("Sucessfully uploaded");
      console.log(response.url)


      return response;
   }catch(err)
   {
    fs.unlinkSync(localfilepath); // Remove the locally saved temporary file as operation get failed

    return null;
   }
}

export {uploadOnCloudinary};
