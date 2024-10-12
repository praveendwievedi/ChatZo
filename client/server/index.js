const express=require('express')
const dotenv=require('dotenv')
dotenv.config()
const userModel=require('./models/user')
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cors=require('cors')


mongoose.connect(process.env.MONGO_URL).finally((err)=>{
if(err){
    console.log(err);
}
else{
    console.log('Database connected');
}
})

const port=3000
const app=express()
const secretKey=process.env.JWT_SECRET;

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.get('/test',(req,res)=>{
res.send('hello i am working fine')
})

app.post('/user/register',async (req,res)=>{
    const {userName,email,password}=req.body;
    if (!userName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
   const createdUser=await userModel.create({
    userName,
    email,
    password
   })

   let token=jwt.sign({id:createdUser._id},secretKey);
   res.cookie('tokens',token).status(201).json({id:createdUser._id})
   
})

app.listen(port,()=>console.log(`server running on port: ${port}`))