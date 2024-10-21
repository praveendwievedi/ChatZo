const express=require('express')
const router=express.Router()
const userModel=require('../models/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const secretKey=process.env.JWT_SECRET
// const { default: Logo } = require('../../client/src/component/Logo')

router.post('/register', (req,res)=>{
    const {userName,email,password,fullName}=req.body;
    if (!userName || !email || !password || !fullName) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    bcrypt.genSalt(12,(err,salt)=>{
        if(err) return res.status(500)
        bcrypt.hash(password,salt,async(err,hash)=>{
            if(err) return res.status(500)
            const createdUser=await userModel.create({
                userName,
                email,
                password:hash,
                fullName
               })
            //  const {profileImage,userName : username,_id:id} =createdUser

            const token=await jwt.sign({id:createdUser._id,userName:createdUser.userName},secretKey);
            return res.cookie('tokens',token,{
                 sameSite:'none',
                 secure:true,
             }).status(201).json(createdUser)   
        })
     }) 
})

router.post('/login',async (req,res)=>{
    const {email,password}=req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
   const userData=await userModel.findOne({ email})
   if(!userData){
    res.status(401).json('wrong credentials')
   }
   else{
      const isMatch=await bcrypt.compare(password,userData.password)
      console.log(isMatch);
     if(isMatch){
        const token=await jwt.sign({id:userData._id,userName:userData.userName},secretKey);
        // const {profileImage,userName,_id:id}=userData;
       return res.cookie('tokens',token,{
        sameSite:'none',
        secure:true,
       }).status(200).json(userData)
     }
     else{
        res.status(401).json('wrong credentials')
     }
   }
})

router.post('/logout',(req,res)=>{
    
    return res.cookie('tokens','',{sameSite:'none',secure:true}).status(200).send('user Logged out')
    
})

router.get('/profile',(req,res)=>{
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

module.exports=router