const path = require('path')
const express = require('express')
const ejs = require('ejs')
const Nexmo = require('nexmo')
const socketio = require('socket.io')
const cors = require('cors')
const dotenv = require('dotenv')
const colors = require('colors')

//Load env variables
dotenv.config({ path: './config/config.env' })

//Init nexmo
const nexmo = new Nexmo({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
}, { debug: true })

//Init App
const app = express()

//Cors
app.use(cors())

//Static Public Folder
app.use(express.static(path.join(__dirname, 'public')))

//BodyParser Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//EJS Template Middleware
app.set('view engine', 'ejs')

//Routes
//@desc Index Page Routes
//@routes GET /
app.get('/', (req, res) => {
    res.render('pages/index')
})


//@desc Catch The Data From ClientSide
//@routes POST /
app.post('/', (req, res) => {

    const number = req.body.number
    const text = req.body.text

    nexmo.message.sendSms(
        'Vonage APIs', number, text, { type: 'unicode' },
        (err, responseData) => {
            if (err) {
                console.error(err)
            } else {
                console.dir(responseData)
                const data = {
                    id: responseData.messages[0]['message-id'],
                    number: responseData.messages[0]['to']
                }
                //Emit to Client
                io.emit('smsStatus', data)
            }
        }
    )
})

//Define Port 
const PORT = process.env.PORT || 3000

//Start Server
const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`.cyan.bold))

//Connect to Socket.io
const io = socketio(server)

io.on('connection', (socket) => {
    console.log('Socket Connected'.yellow.bold)
    io.on('disconnect', () => {
        console.log('Socket Disconnected'.red.bold)
    })
})