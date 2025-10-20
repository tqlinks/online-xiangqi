// client/src/components/ChessBoard.jsx

import React, { useState, useEffect } from 'react';
import Piece from './Piece';
import { fenToBoard, getLegalMoves, getPieceAt } from '../logic/XiangqiLogic';
import './ChessBoard.css'; // Cần tạo file CSS này

const ChessBoard = ({ fen, turn, playerTeam, onMove }) => {
    const board = fenToBoard(fen);
    const [selectedPos, setSelectedPos] = useState(null); // [row, col]
    const [validMoves, setValidMoves] = useState([]);

    const currentTurnTeam = turn === 'w' ? 'RED' : 'BLACK';
    const isMyTurn = playerTeam === currentTurnTeam;

    useEffect(() => {
        // Reset khi FEN thay đổi
        setSelectedPos(null);
        setValidMoves([]);
    }, [fen]);
    
    // Xử lý click chuột
    const handleSquareClick = (row, col) => {
        if (!isMyTurn) return; // Không phải lượt mình đi
        
        const piece = getPieceAt(board, row, col);
        
        if (selectedPos) {
            const [sRow, sCol] = selectedPos;
            const isLegal = validMoves.some(([r, c]) => r === row && c === col);
            
            if (isLegal) {
                // THỰC HIỆN NƯỚC ĐI
                onMove(sRow, sCol, row, col);
                setSelectedPos(null);
                setValidMoves([]);
            } else if (piece && piece.team === playerTeam) {
                // Chọn quân khác của mình
                setSelectedPos([row, col]);
                setValidMoves(getLegalMoves(board, row, col));
            } else {
                // Click ra ngoài hoặc vào ô không hợp lệ
                setSelectedPos(null);
                setValidMoves([]);
            }
            
        } else if (piece && piece.team === playerTeam) {
            // Lần đầu chọn quân của mình
            setSelectedPos([row, col]);
            setValidMoves(getLegalMoves(board, row, col));
        }
    };
    
    // Hiển thị bàn cờ
    const renderBoard = () => {
        // Xoay bàn cờ nếu người chơi là Đen (phù hợp với quy ước cờ tướng online)
        const displayBoard = playerTeam === 'BLACK' ? [...board].reverse() : board;
        const startRow = playerTeam === 'BLACK' ? 9 : 0;
        
        return displayBoard.map((rowArr, rowIndex) => {
            // Tính lại tọa độ thực tế trên board 10x9
            const actualRow = playerTeam === 'BLACK' ? startRow - rowIndex : startRow + rowIndex;
            
            return (
                <div key={rowIndex} className="board-row">
                    {rowArr.map((pieceChar, colIndex) => {
                        const isSelected = selectedPos?.[0] === actualRow && selectedPos?.[1] === colIndex;
                        const isValidMove = validMoves.some(([r, c]) => r === actualRow && c === colIndex);
                        
                        let className = "square";
                        if (isSelected) className += " selected";
                        if (isValidMove) className += " valid-move";
                        
                        return (
                            <div 
                                key={colIndex} 
                                className={className}
                                onClick={() => handleSquareClick(actualRow, colIndex)}
                            >
                                <Piece pieceChar={pieceChar} />
                                {isValidMove && <div className="move-dot"></div>}
                            </div>
                        );
                    })}
                </div>
            );
        });
    };

    return (
        <div className="chessboard-container">
            {/* Vẽ bàn cờ (sông, cung tướng) qua CSS */}
            <div className={`chessboard ${playerTeam === 'BLACK' ? 'rotated' : ''}`}>
                {renderBoard()}
            </div>
        </div>
    );
};

export default ChessBoard;
