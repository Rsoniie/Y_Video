
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
    });




const uploadOnCloudinary = async (localfilepath) => {
   try {
      if(!localfilepath) return null;
      const response = await cloudinary.uploader.upload(localfilepath, {resource_type: "auto"})
      console.log("Sucessfully uploaded");
      console.log(response.url)
      fs.unlinkSync(localfilepath); 
      return response;
   }catch(err)
   {

    fs.unlinkSync(localfilepath); // Remove the locally saved temporary file as operation get failed

    return null;
   }
}

export {uploadOnCloudinary};
