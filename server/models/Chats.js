const mongoose =require('mongoose')
const {Schema }=mongoose


const chatSchema=new Schema({
    sender:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    recipent:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    text:{
      type:String
    }
},{timestamps:true})

const chatModel= mongoose.model('Chat',chatSchema)

module.exports=chatModel