import  { WebSocketServer , WebSocket } from 'ws';

const wss = new WebSocketServer({ port : 8080});

let userCount = 0;
let allsocket: WebSocket[] = [];

wss.on("connection", (socket)=>{
    allsocket.push(socket);

     userCount = userCount + 1;
      console.log("user connected " + userCount);

    socket.on("message" , (message)=>{
        console.log("message received " + message.toString());
        for( let i =0 ;  i < allsocket.length ; i++){
            const s:any = allsocket[i];
          
            s.send(message.toString() + ": send from the server");

        }
        socket.send(message.toString()+ ": sent from the server");

    })
    
})


