// client/src/components/Piece.jsx

import React from 'react';

// Ánh xạ ký hiệu FEN tới tên file ảnh
const PIECE_ASSETS = {
    'r': 'black-r.png', 'n': 'black-n.png', 'b': 'black-b.png', 'a': 'black-a.png',
    'k': 'black-k.png', 'c': 'black-c.png', 'p': 'black-p.png',
    'R': 'red-r.png', 'N': 'red-n.png', 'B': 'red-b.png', 'A': 'red-a.png',
    'K': 'red-k.png', 'C': 'red-c.png', 'P': 'red-p.png'
};

const Piece = ({ pieceChar, onClick }) => {
    if (!pieceChar || !PIECE_ASSETS[pieceChar]) return null;

    const imgSrc = `/pieces/${PIECE_ASSETS[pieceChar]}`;

    return (
        <img 
            src={imgSrc} 
            alt={pieceChar} 
            className="piece" 
            onClick={onClick}
            style={{ 
                width: '100%', 
                height: '100%', 
                cursor: 'pointer' 
            }}
        />
    );
};

export default Piece;
