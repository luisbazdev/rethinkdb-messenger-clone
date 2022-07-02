import { io } from "socket.io-client";

export var socket = io(process.env.REACT_APP_DOMAIN);

