var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const cors = require('cors');

var clients = {};

app.use(cors());

app.get('/', function(req, res){
    res.send('server is running');
});

io.on("connection", function (client) {

    client.on("join", function(name){
      console.log("Joined: " + name);
      clients[client.id] = name;
      client.emit("update", JSON.stringify({msg: "You are connected to the server", server: true}));
      client.broadcast.emit("update", JSON.stringify({msg: `${name} has joined the server`, server: true}));
    });
  
    client.on("send", function(msg){

      client.broadcast.emit("chat", JSON.stringify({name: clients[client.id], msg: msg, external: true}));
    });
  
    client.on("disconnect", function(){
      console.log("Disconnected: " + clients[client.id]);
      io.emit("update", JSON.stringify({msg: `${clients[client.id]} has left the server`, server: true}));
    });
});

http.listen(3000, function(){
    console.log('listening on port 3000');
});