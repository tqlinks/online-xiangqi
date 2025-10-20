// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Thay thế bằng địa chỉ Frontend
        methods: ["GET", "POST"]
    }
});

// ----------------------------------------------------
// PHẦN LOGIC SOCKET.IO (GAME ONLINE) SẼ Ở ĐÂY
// ----------------------------------------------------
let games = {}; // Lưu trữ trạng thái các phòng game

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Xử lý tạo phòng hoặc tìm đối thủ
    socket.on('join_game', (data) => {
        // Logic tìm đối thủ đơn giản (ví dụ)
        let foundGameId = Object.keys(games).find(id => games[id].players.length === 1);

        if (foundGameId) {
            // Tham gia phòng có sẵn
            socket.join(foundGameId);
            games[foundGameId].players.push({ id: socket.id, team: 'BLACK' });
            io.to(foundGameId).emit('game_start', games[foundGameId]);
            console.log(`User ${socket.id} joined game ${foundGameId}`);
        } else {
            // Tạo phòng mới
            const newGameId = socket.id; // Dùng socket ID làm Game ID đơn giản
            socket.join(newGameId);
            games[newGameId] = {
                id: newGameId,
                players: [{ id: socket.id, team: 'RED' }],
                boardState: 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1', // FEN khai cuộc
                turn: 'RED',
            };
            socket.emit('wait_for_opponent');
            console.log(`User ${socket.id} created game ${newGameId}`);
        }
    });

    // Xử lý nước đi
    socket.on('make_move', (data) => {
        const { gameId, move } = data;
        const game = games[gameId];

        if (!game) return;

        // KIỂM TRA LUẬT CHƠI (NÊN DÙNG THƯ VIỆN/LÓGIC CỜ TƯỚNG TẠI ĐÂY)
        // ... Logic kiểm tra hợp lệ, cập nhật boardState, đổi lượt turn

        // Giả sử nước đi hợp lệ:
        // game.boardState = updatedBoardState;
        // game.turn = game.turn === 'RED' ? 'BLACK' : 'RED';

        // Gửi cập nhật đến tất cả người chơi trong phòng
        io.to(gameId).emit('move_made', {
            newBoardState: game.boardState,
            newTurn: game.turn,
            lastMove: move,
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Xóa phòng hoặc thông báo đối thủ rời đi
        // ...
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
