/*
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
*/

var express = require('express'),
    app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(3000);


//io.set('log level',1);

//io.configure('development', function(){
//  io.set('transports', ['xhr-polling']);
//});

app.use('/resource', express.static(__dirname + '/resource'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
var beaconRegions =
[
    {},
    {
            id: "Cherry's Shop 1",
            uuid:'2D85ED40-54D1-5961-B388-ABDFD8FD64A5',
            major: 1,
            minor: 1
    },
    {
            id: "Cherry's Shop 2",
            uuid:'2D85ED40-54D1-5961-B388-ABDFD8FD64A5',
            major: 1,
            minor: 2
    },
    {
            id: "Cherry's Shop 3",
            uuid:'2D85ED40-54D1-5961-B388-ABDFD8FD64A5',
            major: 1,
            minor: 3
    },
    {
            id: "Cherry's Shop 4",
            uuid:'2D85ED40-54D1-5961-B388-ABDFD8FD64A5',
            major: 1,
            minor: 4
    },
    {
            id: "Cherry's Shop 5",
            uuid:'2D85ED40-54D1-5961-B388-ABDFD8FD64A5',
            major: 1,
            minor: 5
    }
];
var listUser = [];
console.log("Server started");
io.sockets.on('connection',function(socket){
    
    socket.room = socket.id;
    socket.join(socket.id);
    
    socket.emit('event-server-news',{action : 'responseConnection',data : {isSuccess:1,message:'Connection is successful'}});
    
    socket.on('event-client-action',function(data){
            var action = data.action;
            switch (action) {
                case 'registerBeacon':
                    var ibeacon_index = data.data.ibeacon;
                    if ( ibeacon_index > 0 && ibeacon_index < beaconRegions.length) {
                      var beacon = beaconRegions[ibeacon_index];
                      listUser.push({socket_id : socket.id, beacon : beacon});
                      console.log("new user register. total users : "+listUser.length);
                      socket.emit('event-server-news',{action : 'responseRegisterBeacon',data:{isSuccess : 1,beacon : beacon,message : 'Registered'}});
                    }else{
                      socket.emit('event-server-news',{action : 'responseRegisterBeacon',data:{isSuccess : 0,message : 'No this iBeacon'}});
                    }
                   
                    break;
                case 'sendLink':
                    var link = data.data.link;
                    var ibeacon = data.data.ibeacon;
                    for(var i = 0 ; i < listUser.length;i++){
                        var beacon = listUser[i];
                        if (beacon.minor == ibeacon) {
                            io.sockets.socket(listUser[i].socket_id).emit('event-server-news',{action : 'sendLink',data : { link : link }});
                            break;
                        }
                    }
                default:
                    break;
            }
        });
    socket.on('disconnect',function(){
      console.log("have disconnect.");
        for(var i = 0 ; i < listUser.length;i++){
            if (listUser[i].socket_id == socket.id) {
              listUser.splice(i,1);
              console.log("total users : "+listUser.length);
              break;
            }
          }
      });
    
    });
    
    