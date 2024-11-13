// 選取畫布和工具列元素
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const brushSizeInput = document.getElementById('brushSize');
const sizeDisplay = document.getElementById('sizeDisplay');
const toggleBrushButton = document.getElementById('toggleBrush');
const saveImageButton = document.getElementById('saveImage');
const clearCanvasButton = document.getElementById('clearCanvas');
const bgToggle = document.getElementById('bgToggle');
const bgColorPicker = document.getElementById('bgColor');
const brushColorPicker = document.getElementById('brushColor');
const resizeHandle = document.getElementById('resizeHandle');

// 設定畫布尺寸
canvas.width = 800;
canvas.height = 600;

// 畫筆設定
let painting = false;
let brushSize = parseInt(brushSizeInput.value, 10);
let brushEnabled = true; // 畫筆狀態
let brushColor = brushColorPicker.value; // 畫筆顏色

// 更新筆刷大小
brushSizeInput.addEventListener('input', () => {
    brushSize = parseInt(brushSizeInput.value, 10);
    sizeDisplay.textContent = brushSize;
});

// 更新畫筆顏色
brushColorPicker.addEventListener('input', () => {
    brushColor = brushColorPicker.value;
});

// 畫筆開關按鈕
toggleBrushButton.addEventListener('click', () => {
    brushEnabled = !brushEnabled;
    toggleBrushButton.classList.toggle('active', brushEnabled);
    toggleBrushButton.textContent = brushEnabled ? '啟用畫筆' : '停用畫筆';
});

// 匯出時包含背景開關
bgToggle.addEventListener('change', () => {
    bgColorPicker.disabled = !bgToggle.checked;
});

// 清空畫布按鈕
clearCanvasButton.addEventListener('click', () => {
    const confirmClear = confirm("確定要清空畫布嗎？這個動作無法還原！");
    if (confirmClear) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

// 儲存圖檔按鈕
saveImageButton.addEventListener('click', () => {
    const fileName = prompt("請輸入檔案名稱", "canvas_drawing.png");
    if (!fileName) return; // 如果使用者取消則中止

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext('2d');

    // 如果啟用了背景開關，則填充背景顏色
    if (bgToggle.checked) {
        exportCtx.fillStyle = bgColorPicker.value;
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    }

    // 複製畫布內容到新畫布（保留用戶繪圖）
    exportCtx.drawImage(canvas, 0, 0);

    // 將圖檔儲存為 PNG 格式
    exportCanvas.toBlob((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    });
});

// 開始繪畫
canvas.addEventListener('mousedown', (e) => {
    if (brushEnabled) {
        painting = true;
        draw(e);
    }
});

// 停止繪畫
canvas.addEventListener('mouseup', () => {
    painting = false;
    ctx.beginPath();
});

// 繪畫中
canvas.addEventListener('mousemove', draw);

function draw(e) {
    if (!painting) return;

    // 獲取畫布相對於視窗的位置（不需要再加上滾動條的偏移）
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;  // 滑鼠相對於畫布的 X 座標
    const y = e.clientY - rect.top;   // 滑鼠相對於畫布的 Y 座標

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor; // 使用選擇的顏色

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// 新增：拖曳調整畫布大小的功能
let resizing = false;
let startX, startY, startWidth, startHeight;

// 創建虛線元素
const verticalLine = document.createElement('div');
verticalLine.style.position = 'absolute';
verticalLine.style.borderLeft = '2px dashed black'; // 垂直虛線
verticalLine.style.pointerEvents = 'none';  // 讓虛線不會干擾其他操作
document.body.appendChild(verticalLine);

const horizontalLine = document.createElement('div');
horizontalLine.style.position = 'absolute';
horizontalLine.style.borderTop = '2px dashed black'; // 水平虛線
horizontalLine.style.pointerEvents = 'none';  // 讓虛線不會干擾其他操作
document.body.appendChild(horizontalLine);

resizeHandle.addEventListener('mousedown', (e) => {
    resizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = canvas.width;
    startHeight = canvas.height;

    // 顯示虛線
    verticalLine.style.display = '';
    horizontalLine.style.display = '';
});

document.addEventListener('mousemove', (e) => {
    if (resizing) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // 計算新的畫布尺寸
        const newWidth = startWidth + deltaX;
        const newHeight = startHeight + deltaY;

        // 更新虛線元素的位置和尺寸
        verticalLine.style.left = `${e.clientX}px`;  // 垂直虛線的 x 位置
        verticalLine.style.top = `${canvas.getBoundingClientRect().top}px`;  // 垂直虛線從畫布上邊開始
        verticalLine.style.height = `${e.clientY - canvas.getBoundingClientRect().top}px`;  // 高度為畫布上邊到滑鼠位置

        horizontalLine.style.top = `${e.clientY}px`;  // 水平虛線的 y 位置
        horizontalLine.style.left = `${canvas.getBoundingClientRect().left}px`;  // 水平虛線從畫布左邊開始
        horizontalLine.style.width = `${e.clientX - canvas.getBoundingClientRect().left}px`;  // 寬度為畫布左邊到滑鼠位置
    }
});

document.addEventListener('mouseup', (e) => {
    if (resizing) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // 計算新的畫布尺寸
        const newWidth = startWidth + deltaX;
        const newHeight = startHeight + deltaY;

        // 儲存畫布當前內容
        let canvasData = canvas.toDataURL();

        // 更新畫布的大小
        canvas.width = newWidth;
        canvas.height = newHeight;

        // 重新繪製畫布內容
        const img = new Image();
        img.src = canvasData;
        img.onload = () => {
            ctx.drawImage(img, 0, 0); // 重新繪製內容
        };

        // 結束重設大小
        resizing = false;

        // 隱藏虛線
        verticalLine.style.display = 'none';
        horizontalLine.style.display = 'none';
    }
});
