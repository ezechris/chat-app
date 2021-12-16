const express = require("express");
const bodyparser = require("body-parser");
const http = require("http");

const socketio = require("socket.io");
const formatMessage = require("./utils/messages")


 const app = express();

// 
const server = http.createServer(app);

const io = socketio(server)

app.use(express.static("public"))

var botName = "Bot" 

// io listens to all conections and disconnections while socket specifically targets either a connection or disconnection
io.on("connection", socket =>{


    console.log("the new connection started"); 
    // only user sees this
    socket.emit("message", formatMessage(botName, "welcome to chatapp"))


    // broadcast: for everyone except the person who's just joined the chat
    socket.broadcast.emit("message", formatMessage(botName, "a user has joined this chat")) 

   
    // people left in the group sees this when a user disconnects
    socket.on("disconnect", ()=>{
        io.emit("message", formatMessage(botName, " a user has left the chat"))
    })
    socket.on("chatMessaging", msg=>{
        io.emit("message",formatMessage("user", msg))
    })
})

const port = process.env.PORT ||65535

app.get("/", (req, res)=>{
res.sendFile(__dirname + "/index.html")
});



server.listen(port, (req, res)=>{
console.log(`server starts at http://localhost:${port}`)
});