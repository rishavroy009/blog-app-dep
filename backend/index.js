const express=require('express');
const { default: mongoose } = require('mongoose');
const dotenv=require('dotenv')
const cors=require('cors')
const multer=require('multer')
const cookieParser=require('cookie-parser')
const app=express();
const path=require('path')
const authRoute=require('./routes/auth')
const userRoute=require('./routes/users')
const postRoute=require('./routes/posts')
const commentRoute=require('./routes/comments')
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("db connected")
    }
    catch(err){
console.log(err)
    }
}
//middlewares
dotenv.config()
app.use(express.json())
//converts the json string to json object format so that it can be accessed easily
app.use("/images",express.static(path.join(__dirname,"/images")))
//Any request made to URLs starting with "/images" will be served by static files located in the "/images" directory relative to the directory where this code file resides.
// if you have an image file named "example.jpg" located in the "/images" directory, you can access it using the URL "/images/example.jpg
app.use(cors({origin:"http://localhost:5173",credentials:true}))
//so that requests can only be recieved from my frontend only
app.use(cookieParser())
//extracts the cookie data and make it usable for server
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comments",commentRoute)


//image upload
const storage=multer.diskStorage({
    destination:(req,file,fn)=>{
        fn(null,"images")
    },
    filename:(req,file,fn)=>{
        fn(null,req.body.img)
        // fn(null,"image1.jpg")
    }
})
//created a storage instance for multer

const upload=multer({storage:storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{
    // console.log(req.body)
    res.status(200).json("Image has been uploaded successfully!")
})
//uploading to storage



app.listen(process.env.PORT,()=>{
    connectDB()
    console.log("Port is running on "+process.env.PORT)
})