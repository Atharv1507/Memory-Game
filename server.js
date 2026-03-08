import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 }); // 'wss' for Web Socket Server
const cardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Pairs for a memory game

const rooms = {}; 

wss.on('connection', (socket) => {
    socket.on('message', (rawData) => {
        const message = JSON.parse(rawData);
        
        if (message.type === 'JOIN') {
            const { roomId } = message;
            
            if (!rooms[roomId]) {

                rooms[roomId] = {
                    clients: [],
                    deck: [...cardValues].sort(() => Math.random() - 0.5) 
                };
            }
            if (rooms[roomId].clients.length >=2) {
                socket.send(JSON.stringify({ type: 'ERROR', message: 'Room is full' }));
                return;
            }
            rooms[roomId].clients.push(socket);
            socket.playerId=rooms[roomId].clients.length
            socket.roomId = roomId;

                socket.send(JSON.stringify({ 
                    type: 'JOIN_SUCCESS', 
                    deck: rooms[roomId].deck ,
                    playerId:socket.playerId
                }));
            
            console.log(`Player joined ${roomId}. Sending common deck.`);
        }
        if (message.type === 'MOVE') {
            const roomId = socket.roomId; 
            const clients = rooms[roomId].clients;

            if (clients) {
                clients.forEach((client) => {
                    // readyState 1 means OPEN
                    if (client !== socket && client.readyState === 1) { 
                        client.send(JSON.stringify({
                            type: 'REMOTE_MOVE',
                            payload: message.payload
                        }));
                    }
                });
            }
        }
    });

    socket.on('error', (error) => console.error(`Error: ${error.message}`));

    socket.on('close', () => { 
        const roomId = socket.roomId;

        if (roomId && rooms[roomId]) {
            rooms[roomId].clients = rooms[roomId].clients.filter(client => client !== socket);

            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
            }
        }
    });
});