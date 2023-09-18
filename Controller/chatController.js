const Chat = require('../Models/chatModel')
const addChat = async(req,res)=>{
    try {
        console.log("enetered ad chat")
        console.log("message : ",req.body)
        const time = new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes()
        const chatData= new Chat({
            user:req.id,
            sender:req.body.sender,
            message:req.body.message,
            time:time
        })
        await chatData.save()
        res.status(200).json({messsage:"successfully added chat",chatData})
    } catch (error) {
        console.log('error',error.messsage)
    }
}


const getChats = async(req,res)=>{
    try {
        console.log("enetered get chat")
        const messageData = await Chat.find({user:req.id}).sort({ createAt: 1 })
        console.log("messageData : ",messageData)
        res.status(200).json({message:"successfully added chat",messageData})
    } catch (error) {
        console.log('error',error.message)
    }
}


module.exports={
    addChat,
    getChats
}