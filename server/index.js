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
const cloudinary =require('cloudinary').v2;


mongoose.connect(process.env.MONGO_DEV_URL).finally((err)=>{
           if(err)console.log(err);
           else console.log('mongodb connected');
        })

        // console.log(process.env.PORT);

const port=process.env.PORT || 3000;
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

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


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

app.get('/allusers',async(req,res)=>{
   const users=await userModel.find({},{_id:1,userName:1})
   res.json(users);
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
    
   const userData=await userModel.findOne({ email,password},{userName:1,_id:1})

   if(userData){
        const token=await jwt.sign({id:userData._id,userName:userData.userName},secretKey);
        const {profileImage,userName,_id:id}=userData;
      return res.cookie('tokens',token,{
        sameSite:'none',
        secure:true,
       }).status(200).json(userData)
    
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
   
    //here this function will send the data of online clients every 3 seconds.
    function notifyAboutOnlinePeople() {
        [...wss.clients].forEach(client => {
          client.send(JSON.stringify({
            online:[...wss.clients].map(({userId,userName}) => ( {id:userId,userName:userName}))
          }));
        });
      }
    
      connection.isAlive = true;
    
      //this timer is runing for  every three second till client close the connection
      connection.timer = setInterval(() => {
        connection.ping();
        connection.deathTimer = setTimeout(() => {
          connection.isAlive = false;
          clearInterval(connection.timer);
          connection.terminate();
          notifyAboutOnlinePeople();
        }, 1000);
      }, 3000);
    
      //this will respond to the ping send to the wss server, if it is alive then death timer will be cleaned.
      connection.on('pong', () => {
        clearTimeout(connection.deathTimer);
      });
    



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

    connection.on('message',async(msg)=>{
        // console.log(msg);
        
        const messageData=JSON.parse(msg)
        const {recipent,text} =messageData   

        if(recipent){
            // console.log({recipent,text});
            // if(file){
            //  const uploadResponse = await cloudinary.uploader.upload(file.data, {
            //         resource_type: 'auto',
            //         public_id: file.name.split('.')[0], // optional: use filename without extension
            //       });

            //       const chatMessage = new chatModel({
            //         sender: connection.userId, // Assuming senderId is sent from the client
            //         recipent: recipent, // Assuming recipientId is sent from the client
            //         file: {
            //           fileName: file.name,
            //           url: uploadResponse.secure_url,
            //         },
            //       });
          
            //       await chatMessage.save();

            //       [...wss.clients].filter(client => client.userId === recipent)
            //        .forEach(client => client.send(JSON.stringify({
            //         file,
            //         _id:chat._id,
            //         sender:connection.userId,
            //         recipent
            //        })))

            // }
            // else{
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
        // }
    });

    //sending all the online users
    [...wss.clients].forEach(client =>{
        client.send(JSON.stringify({
            online:[...wss.clients].map(({userId,userName}) => ( {id:userId,userName:userName}))
        }))
    })
    
})
// wss.on('message')

