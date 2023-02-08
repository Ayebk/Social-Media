const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const checkAuth = require('../middleware/checkAuth');
const signature = require('../model/cloudinary');

const cloudName = process.env.CLOUDINARY_CLOUD_NAME


const apiKey = process.env.CLOUDINARY_API_KEY



// using this API should require authentication
router.get('/', function (req, res) {
  const sig = signature.signuploadform()
  res.json({
    signature: sig.signature,
    timestamp: sig.timestamp,
    cloudname: cloudName,
    apikey: apiKey
  })
})

module.exports = router





