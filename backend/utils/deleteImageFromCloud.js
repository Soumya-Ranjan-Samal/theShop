import { v2 as cloudinary} from 'cloudinary';
import { configDotenv } from 'dotenv';

configDotenv();

cloudinary.config({
    cloud_name: "duwup3a7i",
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


async function deleteImage(imageId){
    try{
        console.log('got to delete');
        let res = await cloudinary.uploader.destroy(imageId);
        console.log(res);
        return true;
    }catch(error){
        console.log(error);
        return false;
    }
}

export default deleteImage;