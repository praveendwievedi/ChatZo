const express=require('express')
const dotenv=require('dotenv')
dotenv.config()
const userModel=require('./models/user')
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cors=require('cors')


mongoose.connect(process.env.MONGO_DEV_URL).finally((err)=>{
           if(err)console.log(err);
           else console.log('mongodb connected');
        })

const port=3000
const app=express()
const secretKey=process.env.JWT_SECRET;

app.use(cors({
    origin:process.env.CLIENT_ORIGIN,
    credentials:true,
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.get('/test',(req,res)=>{
res.send('hello i am working fine')
})

app.get('/user/profile',(req,res)=>{

    const token=req.cookies?.tokens;
    if(!token){
        return res.status(401).json('not authorized')
    }
    else{
        const userData= jwt.verify(token,secretKey)
        return res.json(userData)
    }
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

 await jwt.sign({id:createdUser._id,userName},secretKey,{},(token,err)=>{
   return res.cookie('tokens',token).status(201).send('looged in')
 });
   
})

app.post('/user/login',async (req,res)=>{
    const {email,password}=req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
   const userData=await userModel.findOne({ email})

 await jwt.sign({id:userData._id,userName:userData.userName},secretKey,{},(token,err)=>{
   return res.cookie('tokens',token).status(201).send('looged in')
 });
   
})

app.listen(port,()=>console.log(`server running on port: ${port}`))
