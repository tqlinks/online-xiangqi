// client/src/logic/XiangqiLogic.js

// KHỞI TẠO LOGIC CỜ TƯỚNG (MÔ PHỎNG SỬ DỤNG THƯ VIỆN)
// Trong thực tế, bạn nên sử dụng thư viện hoặc triển khai logic FEN/luật chơi đầy đủ.

const BOARD_SIZE = { rows: 10, cols: 9 };
const STARTING_FEN = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';

// Cấu trúc một quân cờ
const PIECE_MAP = {
    'r': { name: 'Xe', team: 'BLACK' }, 'n': { name: 'Mã', team: 'BLACK' },
    'b': { name: 'Tượng', team: 'BLACK' }, 'a': { name: 'Sĩ', team: 'BLACK' },
    'k': { name: 'Tướng', team: 'BLACK' }, 'c': { name: 'Pháo', team: 'BLACK' },
    'p': { name: 'Tốt', team: 'BLACK' },
    'R': { name: 'Xe', team: 'RED' }, 'N': { name: 'Mã', team: 'RED' },
    'B': { name: 'Tượng', team: 'RED' }, 'A': { name: 'Sĩ', team: 'RED' },
    'K': { name: 'Tướng', team: 'RED' }, 'C': { name: 'Pháo', team: 'RED' },
    'P': { name: 'Tốt', team: 'RED' }
};

/**
 * Phân tích FEN thành mảng 2D (Chỉ phần vị trí quân cờ)
 * @param {string} fen
 * @returns {Array<Array<string>>} Mảng 10x9 đại diện bàn cờ
 */
export function fenToBoard(fen) {
    const parts = fen.split(' ')[0].split('/');
    const board = [];
    
    parts.forEach(rowStr => {
        let row = [];
        for (const char of rowStr) {
            if (!isNaN(parseInt(char))) {
                // Là số (ô trống)
                for (let i = 0; i < parseInt(char); i++) {
                    row.push('');
                }
            } else {
                // Là quân cờ
                row.push(char);
            }
        }
        board.push(row);
    });
    return board;
}

/**
 * Lấy thông tin quân cờ tại vị trí (row, col)
 */
export function getPieceAt(board, row, col) {
    const pieceChar = board[row]?.[col];
    if (pieceChar && PIECE_MAP[pieceChar]) {
        return { 
            char: pieceChar, 
            ...PIECE_MAP[pieceChar], 
            pos: [row, col] 
        };
    }
    return null;
}

/**
 * TÍNH TOÁN NƯỚC ĐI HỢP LỆ (Mô phỏng)
 * TRONG DỰ ÁN THỰC TẾ, HÀM NÀY SẼ CỰC KÌ PHỨC TẠP
 * @param {Array<Array<string>>} board - Bàn cờ hiện tại
 * @param {number} row - Hàng của quân cờ
 * @param {number} col - Cột của quân cờ
 * @returns {Array<[number, number]>} Mảng các tọa độ hợp lệ
 */
export function getLegalMoves(board, row, col) {
    const piece = getPieceAt(board, row, col);
    if (!piece) return [];
    
    // TRONG THỰC TẾ: Cần tính toán đầy đủ luật (Xe, Mã, Pháo, Chiếu Tướng,...)
    // Ví dụ đơn giản: Tướng chỉ đi 1 ô ngang/dọc trong cung
    
    const possibleMoves = [];
    const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Hàng xóm
    
    if (piece.name === 'Tướng') {
        for (const [dr, dc] of deltas) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            // Kiểm tra trong cung (ví dụ: hàng 0-2, cột 3-5 cho Đen)
            if (newRow >= 0 && newRow <= 2 && newCol >= 3 && newCol <= 5) {
                possibleMoves.push([newRow, newCol]);
            }
        }
    }
    
    // ... CÁC QUÂN KHÁC ...
    
    // (Bỏ qua logic kiểm tra Tướng bị Chiếu sau khi di chuyển để đơn giản hóa)
    return possibleMoves.filter(([r, c]) => {
        const targetPiece = getPieceAt(board, r, c);
        return !targetPiece || targetPiece.team !== piece.team; // Không ăn quân mình
    });
}

/**
 * Thực hiện một nước đi và trả về FEN mới
 * @param {string} currentFen 
 * @param {number} startRow 
 * @param {number} startCol 
 * @param {number} endRow 
 * @param {number} endCol 
 * @returns {string} FEN mới
 */
export function makeMove(currentFen, startRow, startCol, endRow, endCol) {
    // TRONG THỰC TẾ: Sử dụng thư viện để thực hiện nước đi và trả về FEN mới
    // Do không có thư viện, chúng ta giả lập bằng cách chỉ thay đổi vị trí quân cờ
    const board = fenToBoard(currentFen);
    const pieceChar = board[startRow][startCol];
    
    board[endRow][endCol] = pieceChar;
    board[startRow][startCol] = '';

    // Tạo lại FEN mới (giả định)
    // Phần này cần logic phức tạp để chuyển mảng 2D thành chuỗi FEN hợp lệ
    const newBoardPart = board.map(row => {
        let rowFen = '';
        let emptyCount = 0;
        row.forEach(cell => {
            if (cell === '') {
                emptyCount++;
            } else {
                if (emptyCount > 0) {
                    rowFen += emptyCount;
                    emptyCount = 0;
                }
                rowFen += cell;
            }
        });
        if (emptyCount > 0) {
            rowFen += emptyCount;
        }
        return rowFen;
    }).join('/');
    
    // Giả định FEN mới (chỉ thay đổi phần vị trí quân cờ)
    const currentParts = currentFen.split(' ');
    const newTurn = currentParts[1] === 'w' ? 'b' : 'w'; // Đổi lượt
    
    return `${newBoardPart} ${newTurn} - - 0 1`;
}

export const XIANGQI_FEN_START = STARTING_FEN;
