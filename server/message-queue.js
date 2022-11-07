// if the message was not sent to the user, it will be in the message queue
// and will be sent to the user when they connect based on the user ID
// retrieved from the users object
const messageQueue = {};

// add the unrecieved message to the message queue
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    socket.on("join_room", (room) => {
        users[socket.id] = room;
        socket.join(room);
    });
});

// when a user connects, check if they have any messages in the message queue
// if they do, send them the messages
io.on("connection", (socket) => {
    if (messageQueue[socket.id]) {
        messageQueue[socket.id].forEach((message) => {
        socket.emit("receive_message", message);
        });
        delete messageQueue[socket.id];
    }
    });

