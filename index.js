const express = require('express')  
const app = express()
const port = process.env.PORT || 3000
const http = require('http')
const socket = require('socket.io')
const server = http.createServer(app)
const {generateMsg,generateLocationMsg}= require('./utils/messages.js')
const {addUser,getUser,getUsersInRoom,removeUser} = require('./utils/users')
const io = socket(server)
app.use(express.static('public'))

app.get('/',async (req,res)=>{
    res.send("index.html")
})
io.on('connection',(socket)=>{
    socket.on('sendMsg',(msg,callBack)=>{
        const user = getUser(socket.id)
        if(user){
            io.to(user.room).emit('welcomeMsg',generateMsg(user.username,msg))
            callBack()
        }

    })
    socket.on('join',({username,room},callBack)=>{
        const {error,user}=addUser({id: socket.id ,username,room})
        if(error){
            return callBack(error)
        }
        socket.join(user.room)
        socket.emit('welcomeMsg',generateMsg('Admin',"Welcome!"))
        socket.broadcast.to(user.room).emit('welcomeMsg',generateMsg(user.username,`${user.username} has joined`))
        io.to(user.room).emit('roomData',({room : user.room,users : getUsersInRoom(user.room)}))
        callBack()
    })
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('welcomeMsg',generateMsg(user.username,`${user.username} has left chat`))
            io.to(user.room).emit('roomData',({room : user.room,users : getUsersInRoom(user.room)}))
        }
    })
    socket.on("sendLocation",(location,callBack)=>{
        const user = getUser(socket.id)
        if(user){
            io.to(user.room).emit("locationMessage",generateLocationMsg(user.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`))
            callBack()
        }
    })
})

server.listen(port,()=>{
    console.log("server has connected on",port)
})