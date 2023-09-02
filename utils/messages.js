const generateMsg = (username,text)=>{
    return {
        username,
        message : text,
        createdAt : new Date()
    }
}
const generateLocationMsg = (username,text)=>{
    return {
        username,
        url : text,
        createdAt : new Date()
    }
}
module.exports = {
    generateMsg,
    generateLocationMsg
}