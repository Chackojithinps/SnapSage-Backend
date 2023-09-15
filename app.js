const express = require('express')
require('dotenv').config()
const mongoose = require('./Config/Config')
const { Server } = require('socket.io');
const http = require('http'); // Import http module
const userRouter = require('./Routes/user-router')
const vendorRouter = require('./Routes/vendor-router')
const adminRouter = require('./Routes/admin-router')

const path = require('path')
const cors = require('cors')
const app = express()


app.use(express.json())
app.use(express.static(path.join(__dirname, 'Public')))
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ['GET', 'POST', 'PATCH'],
  credentials: true
}))
app.use('/', userRouter)
app.use('/vendor', vendorRouter)
app.use('/admin', adminRouter)

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});


io.on('connection', (socket) => {
  socket.on('send_message', (data) => {
    // io.emit("message", message);
    console.log("received message : ",data)
    socket.emit("receive_message",data)
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log("listen to port 3000"))