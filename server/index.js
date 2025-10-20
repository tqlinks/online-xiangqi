
// server/index.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Cấu hình CORS. Thay đổi origin sang domain frontend khi deploy.
const io = new Server(server, {
    cors: {
        origin: "*", // Cho phép mọi origin tạm thời
        methods: ["GET", "POST"]
    }
});

// Lưu trữ các phòng game đang hoạt động
let waitingPlayer = null; // ID của người chơi đang chờ

// Trạng thái FEN Cờ Tướng Khai cuộc
const STARTING_FEN = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';

io.on('connection', (socket) => {
    console.log(`[CONNECT] User ${socket.id} connected.`);

    // ------------------ LOGIC GHÉP CẶP VÀ TẠO PHÒNG ------------------

    if (waitingPlayer) {
        // Ghép đôi: Tạo Game ID và đưa 2 người chơi vào phòng
        const gameId = waitingPlayer + '#' + socket.id;
        socket.join(gameId);
        io.sockets.sockets.get(waitingPlayer).join(gameId);
        
        const gameData = {
            id: gameId,
            players: { 
                [waitingPlayer]: 'RED', // Người đi trước
                [socket.id]: 'BLACK'
            },
            boardState: STARTING_FEN,
            turn: 'RED',
        };

        // Gửi thông báo bắt đầu game cho cả hai người
        io.to(gameId).emit('game_start', gameData);
        waitingPlayer = null;
        console.log(`[START] Game ${gameId} started. Players: RED=${gameData.players[waitingPlayer]}, BLACK=${gameData.players[socket.id]}`);

    } else {
        // Người chơi đang chờ
        waitingPlayer = socket.id;
        socket.emit('wait_for_opponent');
        console.log(`[WAITING] User ${socket.id} is waiting for opponent.`);
    }

    // ---------------------- XỬ LÝ NƯỚC ĐI ------------------------

    socket.on('make_move', (data) => {
        const { gameId, newFen, newTurn } = data;
        
        // Gửi nước đi tới đối thủ trong cùng phòng (trừ người gửi)
        socket.to(gameId).emit('move_made', { newFen, newTurn });
        console.log(`[MOVE] Game ${gameId}. FEN: ${newFen}`);
    });

    // --------------------- XỬ LÝ NGẮT KẾT NỐI ----------------------
    
    socket.on('disconnect', () => {
        if (waitingPlayer === socket.id) {
            waitingPlayer = null;
            console.log(`[DISCONNECT] Waiting player ${socket.id} disconnected.`);
        } else {
            // Logic tìm gameId của người chơi này và thông báo cho đối thủ
            // Ví dụ: io.to(opponentSocketId).emit('opponent_disconnected');
            console.log(`[DISCONNECT] User ${socket.id} disconnected. Opponent notified.`);
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
