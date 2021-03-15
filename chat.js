const name_input = document.getElementById("name_input")
const message_input = document.getElementById("message_input")
const chat_window = document.getElementById("chat_window")

const client_id = "chat_client_" + Math.random() * 1000

const options = {
    connectTimeout: 5000,
    clientId: client_id,
    // username: 'emqx',
    // password: 'emqx',
    keepalive: 60,
    clean: true,
}

const WebSocket_URL = 'ws://ip:8083/mqtt'

const client = mqtt.connect(WebSocket_URL, options)

client.on('connect', () => {
    console.log('Connect success')

    client.subscribe('chat', function (error) {
        if(!error) {
            console.log("Subscribe success")
        } else {
            console.error(error)
        }
    })      
})

client.on('reconnect', (error) => {
    console.log('reconnecting:', error)
})

client.on('error', () => {
    console.log('Connect Error:', error)
})

client.on('message', function (topic, message) {
    //console.log(`the topic is ${topic} and the message is ${message.toString()}`)
    
    const received = JSON.parse(message.toString());

    if (received.name.trim() == name_input.value.trim()) {
        chat_window.innerHTML = chat_window.innerHTML + '<div style="color:blue"> <b>' + received.msg + '</b> </div>'
    } else {
        chat_window.innerHTML = chat_window.innerHTML + '<div style="color:grey"> <i>' + received.name + ': </i>' + received.msg + '</div>'
    }

    chat_window.scrollTo =  chat_window.scrollHeight
})

message_input.addEventListener('keyup', function (e) {
    if (e.key === 'Enter' || e.key === 13) {
        
        if (name_input.value == "") {
            chat_window.innerHTML = chat_window.innerHTML + '<div style="color:red"> <b> Your name is empty! </b> </div>'
            return
        }
        const to_send = {
            name: name_input.value,
            msg: message_input.value,

        }
        //console.log(JSON.stringify(to_send))
        client.publish('chat', JSON.stringify(to_send))
        message_input.value = ""
    }
})