import io from "socket.io-client";

// const socket = io("http://192.168.5.180:8800");
// const socket = io("http://localhost:8800");
const socket = io("https://api.ict.lviv.ua");
export default socket;