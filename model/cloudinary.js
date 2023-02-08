const cloudinary = require("cloudinary").v2;


const apiSecret = process.env.CLOUDINARY_API_SECRET;


const signuploadform = () => {
  const timestamp = Math.round((new Date).getTime()/1000);

  const signature = cloudinary.utils.api_sign_request({
    timestamp: timestamp,
   }, apiSecret);

  return { timestamp, signature }
}

module.exports = {
  signuploadform
}


