const {model,Schema, default: mongoose}=require('mongoose')


const userSchema=new Schema({
    userName:{
     type:String,
     required:true,
     unique:true
    },
    fullName:{
        type:String,
        required:true
    },
    email:{
      type:String,
     required:true,
     unique:true
    },
    password:{
      type:String,
      required:true
    },
    profileImage:{
        type:String,
        default:'default.jpg'
    },
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
},{
    timestamps:true
})

const userModel=model('User',userSchema)

module.exports=userModel
