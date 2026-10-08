const multer =require('multer');
const path=require('path');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(process.cwd(),"src","upload"));
    },
    filename:(req,file,cb)=>{
        const uniqueName=Date.now() + "-" + Math.round(Math.random()*1e9) + 
        path.extname(file.originalname);
        cb(null,uniqueName);
    }
}); 
const fileFilter=(req,file,cb)=>{
    const allowedTypes=[
        "image/jpg",
        "image/jpeg",
        "image/png"
    ];
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb(new Error("Only JPEG ,JPG and PNG files are allowed."));
    }
};
const upload=multer({
    storage,
    fileFilter,
    limits:{
        fileSize: 2 * 1024 * 1024
    }
});
module.exports=upload;