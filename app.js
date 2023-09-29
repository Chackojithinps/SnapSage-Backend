const express = require('express')
require('dotenv').config()
const mongoose = require('./Config/Config')
const { Server } = require('socket.io');
const http = require('http'); // Import http module
const userRouter = require('./Routes/user-router')
const vendorRouter = require('./Routes/vendor-router')
const adminRouter = require('./Routes/admin-router')
const Chat = require('./Models/chatModel')
const path = require('path')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'Public')))
app.use(express.urlencoded({ extended: false }));

// /

app.use(cors({
  origin: "https://snapsage.vercel.app", // Remove the trailing slash
  methods: ['GET', 'POST', 'PATCH'],
  credentials: true
}))


app.use('/', userRouter)
app.use('/vendor', vendorRouter)
app.use('/admin', adminRouter)

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://snapsage.vercel.app", // Remove the trailing slash
    methods: ["GET", "POST", "PATCH"],
    credentials: true
  }
});

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // Remove the trailing slash
//     methods: ["GET", "POST", "PATCH"],
//     credentials: true
//   }
// });


io.on('connection', (socket) => {
  socket.on('send_message', async (data) => {
    try {
      // Save the message to the database
      const time = new Date().getHours() + ':' + new Date().getMinutes();
      const chatData = new Chat({
        user: data.user, // Replace with the actual user ID
        sender: data.sender,
        message: data.message,
        time: time,
      });
      await chatData.save();
      // Emit the message to all connected users
      io.emit('receive_message', chatData);
    } catch (err) {
      console.log("err", err.message)
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log("listen to port 5000"))