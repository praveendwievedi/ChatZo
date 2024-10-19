const jwt=require('jsonwebtoken')


const secretKey=process.env.JWT_SECRET

const UserDetails=(req,res,next)=>{
  const token=req.cookies?.tokens;
  if(token){
   const userData=jwt.verify(token,secretKey);
   req.user=userData;
   next();
  }else{
    res.send('not a valid user');
  }
}

module.exports={UserDetails}