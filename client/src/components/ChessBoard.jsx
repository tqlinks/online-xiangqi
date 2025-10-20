/* client/src/components/ChessBoard.css */

/* Định nghĩa chung cho vùng chứa bàn cờ */
.chessboard-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

/* Định nghĩa container chính của bàn cờ (9x10 ô cờ) */
.chessboard {
    display: grid;
    /* 9 cột (8 đường kẻ) */
    grid-template-columns: repeat(9, 60px); 
    /* 10 hàng (9 đường kẻ) */
    grid-template-rows: repeat(10, 60px);
    
    border: 3px solid #663300; /* Viền ngoài */
    background-color: #f0d9b5; /* Màu nền */
    position: relative; /* Dùng cho sông và cung */
}

/* Ẩn các đường chia ô mặc định, vì cờ tướng dùng các đường giao nhau */
.square {
    width: 100%;
    height: 100%;
    /* Quân cờ nằm giữa ô */
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative; 
    box-sizing: border-box; 
    
    /* VẼ CÁC ĐƯỜNG GIAO NHAU: SỬ DỤNG BORDER */
    /* Hàng ngang: Dùng border-bottom cho tất cả ô, trừ hàng cuối */
    border-bottom: 1px solid #333;
    /* Cột dọc: Dùng border-right cho tất cả ô, trừ cột cuối */
    border-right: 1px solid #333;
}

/* Loại bỏ border ở mép phải và mép dưới */
.board-row:last-child .square {
    border-bottom: none;
}
.square:last-child {
    border-right: none;
}

/* ------------------ ĐẶC TRƯNG CỜ TƯỚNG ------------------ */

/* 1. SÔNG (River/Hà) */
/* Sông nằm giữa hàng 5 và hàng 6 (tức là sau khi render 5 hàng) */
.board-row:nth-child(5) .square {
    /* Loại bỏ đường kẻ giữa hàng 5 và 6 */
    border-bottom: none; 
}

/* VẼ DÒNG SÔNG: Dòng chữ "Sông/Hà" có thể đặt trên 2 ô hàng 5 */
.board-row:nth-child(5) {
    /* Thêm một đường viền dày hoặc màu khác để làm nổi bật dòng sông */
    border-bottom: 5px solid #663300; 
}
/* Hoặc dùng pseudo-elements trên .chessboard để vẽ sông */

/* 2. CUNG TƯỚNG (Palace) */
/* Cung Tướng là khu vực 3x3 ở 2 đầu bàn cờ (Hàng 0-2 và Hàng 7-9, Cột 3-5) */
/* Vẽ đường chéo (sử dụng pseudo-elements) */
.board-row:nth-child(1) .square:nth-child(4)::before,
.board-row:nth-child(10) .square:nth-child(4)::before {
    /* Chấm giao điểm 1 */
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-top: 1px solid #333; /* Đường kẻ ngang trên cùng của ô */
    border-left: 1px solid #333; /* Đường kẻ dọc bên trái của ô */
    /* Vị trí các đường chéo cần được tính toán rất phức tạp, 
       thường là dùng SVG hoặc background-image. 
       Đây là cách vẽ đơn giản nhất (chỉ vẽ đường viền) */
}


/* ------------------ HIỆU ỨNG TƯƠNG TÁC ------------------ */

/* 1. Ô được chọn (Selected Square) */
.square.selected {
    background-color: rgba(255, 255, 0, 0.3); /* Tô màu ô đã chọn */
}

/* 2. Nước đi hợp lệ (Valid Move Target) */
.square.valid-move {
    /* Thêm hiệu ứng cho ô có thể đi */
    cursor: crosshair;
}

/* Chấm báo hiệu nước đi */
.move-dot {
    width: 15px;
    height: 15px;
    background-color: rgba(0, 255, 0, 0.5);
    border-radius: 50%;
    position: absolute;
    z-index: 10;
}
