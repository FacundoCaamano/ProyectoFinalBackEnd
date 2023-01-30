let socket = io()
let user = ''
let chatbox = document.getElementById('chatbox')



Swal.fire({
    title:'Autenticacion',
    input: 'text',
    text: 'Escriba su e-mail',
    inputValidator: value=>{
        return !value.trim() && 'Por Favor escriba su e-mail'
    },
    allowOutsideClick: false
}).then(result=>{
    user = result.value
    document.getElementById('usuario').innerHTML = user
    socket.emit('session',user)
})


chatbox.addEventListener('keyup',event=>{
    if(event.key==='Enter'){
        if(chatbox.value.trim().length>0){
            socket.emit('message',{
                user,
                message: chatbox.value
            })
            chatbox.value = ''
        }
    }
})
socket.on('first',data=>{
    const divLog = document.getElementById('message')
    let messages = ''
    data.forEach(message => {
        messages += `<p><i>${message.user}</i>: ${message.message}</p>`
    });
    divLog.innerHTML = messages
    divLog.scrollTo({ left: 0, top: divLog.scrollHeight, behavior: "smooth" });
})
socket.on('logs',data=>{
    const divLog = document.getElementById('message')
    let messages = ''
    data.forEach(message => {
        messages += `<p><i>${message.user}</i>: ${message.message}</p>`
    });
    divLog.innerHTML = messages
    divLog.scrollTo({ left: 0, top: divLog.scrollHeight, behavior: "smooth" });
})