const express=require('express')
const dotenv=require('dotenv')
dotenv.config()
const userModel=require('./models/user')
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cors=require('cors')
const ws=require('ws')


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
    // console.log(req.cookies);
    
    const token=req.cookies?.tokens;
    // console.log(token);
    
    if(!token){
        return res.status(401).send('not authorized')
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

  const token=await jwt.sign({id:createdUser._id,userName:createdUser.userName},secretKey);
   return res.cookie('tokens',token,{
    sameSite:'none',
    secure:true,
}).status(201).send('user created')
})

app.post('/user/login',async (req,res)=>{
    const {email,password}=req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
   const userData=await userModel.findOne({ email,password})

   if(userData){
        const token=await jwt.sign({id:userData._id,userName:userData.userName},secretKey);
      return res.cookie('tokens',token,{
        sameSite:'none',
        secure:true,
       }).status(200).send('user logged in')
    
   }else{
    return res.status(401).send('wrong credentials')
   }
   
})

app.get('/user/logout',(req,res)=>{
    
    return res.cookie('tokens','',{sameSite:'none',secure:true}).status(200).send('user Logged out')
    
})

const server=app.listen(port,()=>console.log(`server running on port: ${port}`))

// const wss=ws.Server({server});

// wss.on('connection',(connected)=>{
//    console.log(connected); 
// })
