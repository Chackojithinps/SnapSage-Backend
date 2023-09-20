const Chat = require('../Models/chatModel')


// --------------------------------------Add chat ------------------------------

const addChat = async (req, res) => {
    try {
        console.log("enetered ad chat")
        console.log("message : ", req.body)
        const time = new Date(Date.now()).getHours() + 
            ":" +
            new Date(Date.now()).getMinutes()
        const chatData = new Chat({
            user: req.id,
            sender: req.body.sender,
            message: req.body.message,
            time: time
        })
        await chatData.save()
        res.status(200).json({ messsage: "successfully added chat", chatData })
    } catch (error) {
        console.log('error', error.messsage)
    }
}

// --------------------------------------get specific user chat------------------------------


const getChats = async (req, res) => {
    try {
        console.log("enetered get chat")
        const messageData = await Chat.find({ user: req.id }).sort({ createAt: 1 })
        console.log("messageData : ", messageData)
        res.status(200).json({ message: "successfully added chat", messageData })
    } catch (error) {
        console.log('error', error.message)
    }
}

// --------------------------------------get all users in chat in admin side------------------------------

const chatLists = async (req, res) => {
    try {
        console.log("enetered get chat Users")
        const chatLists = await Chat.aggregate([
            // {
            //     $sort: {
            //         createdAt: -1
            //     }
            // },
            {
                $group: {
                    _id: '$user',
                    latestChat: {
                        $last: '$$ROOT'
                    },
                }
            },
            {
                $lookup: {
                    from: 'users', // The name of the User collection
                    localField: '_id', // Field from the 'latestChat' subdocument
                    foreignField: '_id', // Field from the User collection
                    as: 'userDetails',
                },
            },
            {
                $unwind: '$userDetails', // Unwind the userDetails array (since $lookup returns an array)
            },
        ])
        chatLists.sort((a, b) => new Date(b.latestChat.createAt) - new Date(a.latestChat.createAt));
        res.status(200).json({message: "Chat list got", chatLists })
    } catch (error) {
        console.log('error', error.message)
    }
}


// --------------------------------------get specific user chat in admin side------------------------------


const userChats = async (req, res) => {
    try {
        console.log("enetered get chat")
        const userId=req.query.id
        const userChats = await Chat.find({user:userId})
        res.status(200).json({ message: "successfully get user  chat" ,userChats})
    } catch (error) {
        console.log('error', error.message)
    }
}

// --------------------------------------Add chat admin side------------------------------

const addChatAdmin = async (req, res) => {
    try {
        console.log("enetered add chat admin")
        console.log("message : ", req.body)
        const time = new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes()
        const chatData = new Chat({
            user: req.body.id,
            sender: req.body.sender,
            message: req.body.message,
            time: time
        })
        await chatData.save()
        res.status(200).json({ messsage: "successfully added chat in admin side", chatData })
    } catch (error) {
        console.log('error', error.messsage)
    }
}
module.exports = {
    addChat,
    getChats,
    chatLists,
    userChats,
    addChatAdmin

}