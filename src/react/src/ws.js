import { io } from "socket.io-client";

export var socket = io(process.env.REACT_APP_DOMAIN);

// socket.emit('set uid', session.user_metadata.sub);


/**
 * socket.on('received message', () => {
 *  ...
 * })
 */

// socket.on('received message', () => {
//     console.log('received message!')
// })
