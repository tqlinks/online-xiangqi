// client/src/App.jsx

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ChessBoard from './components/ChessBoard';
import { XIANGQI_FEN_START, makeMove } from './logic/XiangqiLogic';

// ĐỊA CHỈ SERVER: Dùng biến môi trường (Vercel/Netlify) hoặc fallback về localhost
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
const socket = io(SERVER_URL); 

function App() {
    const [game, setGame] = useState(null); // { id, boardState (FEN), turn, playerTeam }
    const [status, setStatus] = useState('Đang kết nối...');

    useEffect(() => {
        socket.on('connect', () => {
            setStatus('Đã kết nối. Sẵn sàng tìm đối thủ.');
        });

        socket.on('wait_for_opponent', () => {
            setStatus('Đã vào hàng chờ. Đang tìm đối thủ...');
        });

        socket.on('game_start', (gameData) => {
            // Xác định team của người chơi hiện tại
            const playerTeam = gameData.players[socket.id]; 
            setGame({ 
                ...gameData, 
                playerTeam,
                turn: gameData.boardState.split(' ')[1] === 'w' ? 'RED' : 'BLACK'
            });
            setStatus(`Game Bắt Đầu! Bạn là ${playerTeam}.`);
        });

        socket.on('move_made', (data) => {
            const newTurnCode = data.newFen.split(' ')[1];
            const newTurnTeam = newTurnCode === 'w' ? 'RED' : 'BLACK';
            
            setGame(prev => ({ 
                ...prev, 
                boardState: data.newFen,
                turn: newTurnTeam 
            }));
            setStatus(`Lượt của ${newTurnTeam}`);
        });

        socket.on('disconnect', () => {
            setStatus('Mất kết nối với Server.');
        });
        
        // Dọn dẹp listener khi component bị unmount
        return () => {
            socket.off('game_start');
            socket.off('move_made');
            socket.off('disconnect');
        };
    }, []);

    const handleJoinGame = () => {
        socket.emit('join_game');
    };
    
    // Xử lý nước đi sau khi người dùng click
    const handleMove = (startR, startC, endR, endC) => {
        if (!game || game.turn !== game.playerTeam) return;

        // 1. Tính toán FEN mới (sử dụng logic)
        const newFen = makeMove(game.boardState, startR, startC, endR, endC);

        // 2. Gửi FEN mới lên Server
        // Server sẽ chuyển tiếp FEN này đến đối thủ
        socket.emit('make_move', { 
            gameId: game.id, 
            newFen: newFen,
            newTurn: newFen.split(' ')[1] === 'w' ? 'RED' : 'BLACK'
        });
        
        // Cập nhật ngay tại máy của mình
        const newTurnCode = newFen.split(' ')[1];
        const newTurnTeam = newTurnCode === 'w' ? 'RED' : 'BLACK';
        setGame(prev => ({ 
            ...prev, 
            boardState: newFen,
            turn: newTurnTeam
        }));
        setStatus(`Lượt của ${newTurnTeam}`);
    };

    return (
        <div className="App">
            <h1>Cờ Tướng Online - (Xiangqi)</h1>
            <p>Trạng thái: <strong>{status}</strong></p>
            {game && <p>Lượt: {game.turn} | Bạn là: {game.playerTeam}</p>}
            
            {!game && (
                <button onClick={handleJoinGame} disabled={!socket.connected || status.includes('chờ')}>
                    Tìm Đối Thủ Ngay!
                </button>
            )}
            
            {game && (
                <ChessBoard 
                    fen={game.boardState} 
                    turn={game.boardState.split(' ')[1]}
                    playerTeam={game.playerTeam}
                    onMove={handleMove} 
                />
            )}
            
            <p style={{ marginTop: '20px' }}>Server URL: {SERVER_URL}</p>
        </div>
    );
}

export default App;
