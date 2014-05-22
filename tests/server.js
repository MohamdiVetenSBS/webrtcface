var app = require('express')();
var server = require('http').createServer(app);
var webRTC = require('webrtc.io').listen(server);

var port = process.env.PORT || 8090;
server.listen(port);

//console.log(server);

// Events
 // on connect
server.on('connect', function (req, cltSocket, head) {
     console.log('Connect Event : ');      
     console.log(server._connections);

});

server.on('request', function (req, cltSocket, head) {
     console.log('Request Event ');      
     console.log(server);

});


app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.get('/thankyou', function(req, res) {
  res.sendfile(__dirname + '/thanks.html');
});

app.get('/style.css', function(req, res) {
  res.sendfile(__dirname + '/style.css');
});

app.get('/fullscrean.png', function(req, res) {
  res.sendfile(__dirname + '/fullscrean.png');
});

app.get('/script.js', function(req, res) {
  res.sendfile(__dirname + '/script.js');
});


app.get('/webrtc.io.js', function(req, res) {
  res.sendfile(__dirname + '/webrtc.io.js');
});

app.get('/js/:id', function (req, res) {
    res.sendfile(__dirname + '/js/' + req.params.id);
  //  console.log(req);
});
app.get('/fonts/:file', function (req, res) {
    res.sendfile(__dirname + '/fonts/' + req.params.id);
  //
});
app.get('/css/:id', function (req, res) {
    res.sendfile(__dirname + '/css/' + req.params.id);
  //  console.log(req);
});

webRTC.rtc.on('chat_msg', function(data, socket) {
  var roomList = webRTC.rtc.rooms[data.room] || [];

  for (var i = 0; i < roomList.length; i++) {
    var socketId = roomList[i];

    if (socketId !== socket.id) {
      var soc = webRTC.rtc.getSocket(socketId);

      if (soc) {
        soc.send(JSON.stringify({
          "eventName": "receive_chat_msg",
          "data": {
            "messages": data.messages,
            "color": data.color
          }
        }), function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  }
});
