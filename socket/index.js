const io= require("socket.io")(5500,{
    cors :{
        origin:"http://localhost:3000"
    }
})


let activeUsers = [];

io.on("connection",(socket)=>{

    // register new user in socket server
    socket.on('new-user-add',(newUserId)=>{
        // if user is not added previously
        if(!activeUsers.some((user)=>user.userId === newUserId)){
            activeUsers.push({
                userId:newUserId,
                socketId:socket.id
            })
        }
          console.log("connected Users",activeUsers);
          io.emit('get-users',activeUsers)
    })

    socket.on("disconnected",()=>{
        activeUsers = activeUsers.filter((user)=>user.socketId !== socket.id);
    })

})
