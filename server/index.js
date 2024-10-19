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
const path=require('path')
const chatModel=require('./models/Chats')
const {UserDetails} =require('./middlewares/authentication')


mongoose.connect(process.env.MONGO_DEV_URL).finally((err)=>{
           if(err)console.log(err);
           else console.log('mongodb connected');
        })

        // console.log(process.env.PORT);

const port=process.env.PORT
const app=express()
const secretKey=process.env.JWT_SECRET;

app.use(express.static(path.join(__dirname,'public')));
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

app.get('/message/:userId',UserDetails,async(req,res)=>{
    const {userId}=req.params;
    const {id}=req.user;
    
    // console.log({userId,id});
    
    if(!userId || !id){
        res.send('Login first')
    }
    
    const chatDetails=await chatModel.find({
        sender: {$in :[userId,id]},
        recipent:{ $in :[userId,id]}
    }).sort({createdAt: 1})

    res.json(chatDetails)
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
  
   const {profileImage,userName : username,_id} =createdUser

  const token=await jwt.sign({id:createdUser._id,userName:createdUser.userName},secretKey);
   return res.cookie('tokens',token,{
    sameSite:'none',
    secure:true,
}).status(201).json({profileImage,id,username})
})

app.post('/user/login',async (req,res)=>{
    const {email,password}=req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
   const userData=await userModel.findOne({ email,password})

   if(userData){
        const token=await jwt.sign({id:userData._id,userName:userData.userName},secretKey);
        const {profileImage,userName,_id:id}=userData;
      return res.cookie('tokens',token,{
        sameSite:'none',
        secure:true,
       }).status(200).json({profileImage,userName,id})
    
   }else{
    return res.status(401).send('wrong credentials')
   }
   
})

app.get('/user/logout',(req,res)=>{
    
    return res.cookie('tokens','',{sameSite:'none',secure:true}).status(200).send('user Logged out')
    
})

const server=app.listen(port,()=>{console.log(`serever running on ${port}`)})

const wss=new ws.WebSocketServer({server})

wss.on('connection',(connection,req)=>{
    // console.log('connected')
    // connection.send('hello')

    const cookies=req.headers.cookie;
    if(cookies){
        const token=cookies.split('=')[1];
        if(token){
            const userData=jwt.verify(token,secretKey);
            // console.log(userData);
            const {id,userName}=userData
            connection.userId=id;
            connection.userName=userName;
        }
    }
    // console.log([...wss.clients].map(user => user.userName));
    [...wss.clients].forEach(client =>{
        client.send(JSON.stringify({
            online:[...wss.clients].map(({userId,userName}) => ( {id:userId,userName:userName}))
        }))
    })

    connection.on('message',async(msg)=>{
        // console.log(msg);
        
        const messageData=JSON.parse(msg)
        const {recipent,text} =messageData   

        if(recipent){
            // console.log({recipent,text});
            const chat=await chatModel.create({
                recipent,
                sender:connection.userId,
                text
            });
            
            [...wss.clients].filter(client => client.userId === recipent)
            .forEach(client => client.send(JSON.stringify({
                text,
                _id:chat._id,
                sender:connection.userId,
                recipent
            })))
        }
    })
    
})
// wss.on('message')

