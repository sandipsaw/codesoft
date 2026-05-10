import dotenv from 'dotenv'
dotenv.config()

import Imagekit from 'imagekit'
import { v4 as uuidv4 } from 'uuid'

const imagekit = new Imagekit({
    publicKey:process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT
})
const uploadFile = async({buffer}) =>{
    const res = await imagekit.upload({
        file:buffer,
        fileName:uuidv4(),
        folder:"Resume"
    })
    return{
        url:res.url,
        thumbnail:res.thumbnailUrl || res.url,
        id:res.fileId
    }
}
export default uploadFile;