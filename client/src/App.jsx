
// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Kết nối tới Server Backend

function App() {
    const [game, setGame] = useState(null);
    const [status, setStatus] = useState('Đang chờ kết nối...');

    useEffect(() => {
        // Xử lý kết nối thành công
        socket.on('connect', () => {
            setStatus('Đã kết nối. Bấm Bắt đầu để tìm đối thủ.');
        });

        // Xử lý khi game bắt đầu
        socket.on('game_start', (gameData) => {
            setGame(gameData);
            setStatus('Game đã bắt đầu!');
        });

        // Xử lý nước đi từ đối thủ
        socket.on('move_made', (data) => {
            // Cập nhật trạng thái bàn cờ
            setGame(prev => ({ 
                ...prev, 
                boardState: data.newBoardState, 
                turn: data.newTurn 
            }));
        });

        socket.on('wait_for_opponent', () => {
            setStatus('Đã tạo phòng. Đang chờ đối thủ...');
        });

        return () => {
            socket.off('game_start');
            socket.off('move_made');
            socket.off('connect');
        };
    }, []);

    const handleJoinGame = () => {
        socket.emit('join_game', {});
    };

    const handleMakeMove = (start, end) => {
        if (game && game.turn === 'RED') { // Giả sử là phe RED đi
            socket.emit('make_move', {
                gameId: game.id,
                move: { start, end }
            });
        }
    };

    return (
        <div>
            <h1>Cờ Tướng Online</h1>
            <p>Trạng thái: {status}</p>
            {!game && <button onClick={handleJoinGame}>Bắt đầu Game</button>}
            {game && (
                <ChessBoard boardState={game.boardState} onMove={handleMakeMove} />
            )}
        </div>
    );
}
