const numberInput = document.getElementById('number'),
    textInput = document.getElementById('msg'),
    button = document.getElementById('button'),
    response = document.querySelector('.response')

button.addEventListener('click', sendMessage, false)

//Connect To Socket
const socket = io()

//Catch SmsStatus From Server Side
socket.on('smsStatus', function (data) {
    response.innerText = 'Successfully Message Sent to ' + data.number
    setTimeout(() => {
        response.innerText = ''
    }, 5000)
})

function sendMessage() {

    const number = numberInput.value.replace(/\D/g, '')
    const text = textInput.value

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ number, text })
    })
        .then(function (res) {
            console.log(res)
        })
        .catch(function (err) {
            console.error(err)
        })
    numberInput.value = ''
    textInput.value = ''
}