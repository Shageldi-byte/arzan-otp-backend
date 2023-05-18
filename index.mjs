import cors from "cors";
import express from "express";
import fs from "fs";
import { Server } from "socket.io";

const app = express();
let socketIo = null;
app.use(cors());
app.use('/public', express.static('public'));
app.use(express.json({limit: '500mb', extended: true}));
app.use(express.urlencoded({limit: "500mb", extended: true, parameterLimit:500000}));
app.post('/send-code',(req,res)=>{
    const {
        code,
        phoneNumber
    } = req.body;
    socketIo.emit('verification-phone',{
        code,
        phoneNumber
    });
    res.json('success');

})
const server=app.listen(6415, () => {
    console.log(`listening on port 6415`);
})

const io = new Server(server, { 
    cors: {
        origin: '*'
    }
 });

socketIo = io.on("connection", (client) => {
    console.log("Connected  "+client.id);
    client.on('verification-phone', (data)=> {
        console.log(data)
        io.emit('verification-phone', data);
    });
});

app.get('/socket-test', function(req, res) {
    const html=fs.readFileSync('public/index.html', 'utf8');
    res.send(html);
});

