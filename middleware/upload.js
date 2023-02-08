const multer = require('multer');
const path = require('path');


// Multer config
// module.exports = multer({
//   storage: multer.diskStorage({}),
//   fileFilter: (req, file, cb) => {
//     let ext = path.extname(file.originalname);  
//     if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
//       cb(new Error("File type is not supported"), false);
//       return;
//     }
//     cb(null, true);
//   },
// });






const storage = multer.diskStorage({

    destination: (req,file,cb) => {
        cb(null,'uploads/');
    },
    
    filename: (req,file,cb) => {
        cb(null,`${Date.now()}-${file.originalname}`);
    }
})

const fileFilter = (req,res ,cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true); // cb- callback
    }
    cb(null, false);

}

const upload = multer ({

   // dest: 'uploads/',
   storage,
    limits:{
        fileSize: 1024 * 1024 * 2, // 2 MB
        fileFilter
    }
})

module.exports = upload;