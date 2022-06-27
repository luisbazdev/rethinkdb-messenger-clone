var socketIO = require('socket.io');

class SocketService {
   constructor(server){
      this.io = socketIO(server, {
         cors: {
            origin: process.env.DOMAIN
         }
      });

      this.io.on('connection', (socket) => {
         // Add the socket to a room called the
         // same as the user's Facebook UID for
         // future Socket.IO events in router.js
         socket.on('set uid', (uid) => {
            socket.join(uid);
         });
      });
   };

   emit(from, target, event, body){
      if(body)
         this.io.to(from).to(target).emit(event, body);
   };
};

module.exports = SocketService;