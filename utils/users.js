const users = []

const addUser = ({id, username,room})=>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate user and room
    if(!username || !room){
        return {
            error : "Username and room is Invalid"
        }
    }

    //unique user in a specific room

    const findUser = users.find(user=>{
        return user.room === room && user.username === username
    })
    
    if(findUser){
       return {
        error : 'username is in use!'
       } 
    }
    user = {id,username,room}
    users.push(user)
    return {user}
}

const removeUser = id=>{
    const index = users.findIndex(user=> user.id === id)
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}
const getUser = id => {
    return users.find(user=> user.id === id)
}
const getUsersInRoom = room=>{
     room = room.trim().toLowerCase()
    return users.filter(user => user.room === room)
}
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
