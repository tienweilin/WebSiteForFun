// 建立 Vue 應用程式
const app = Vue.createApp({
    data() {
        return {
            title: "歡迎來到我的 Vue.js 靜態網頁",
            showMessage: false,
            message: "這是一個簡單的 Vue.js 互動訊息！", // 預設訊息
            displayedMessage: "",   // 逐漸顯示的文字
            textColor: "#000000", // 預設文字顏色為黑色
            fontSizeRaw: 16, // 預設文字大小（不含 px 單位）
            intervalId: null
        };
    },
    computed: {
        // 使用 computed 屬性來將原始數值轉換為帶有單位的字符串
        fontSize() {
            return this.fontSizeRaw + 'px';
        }
    },
    methods: {
        toggleMessage() {
            this.showMessage = !this.showMessage;

            if (this.showMessage) {
                // 如果顯示訊息，開始動畫並確保清除舊的動畫
                this.startAnimation();
            } else {
                // 隱藏訊息並清空顯示的文字
                this.displayedMessage = "";
                // 停止當前的動畫計時器
                clearTimeout(this.intervalId);
            }
        },

        startAnimation() {
            let index = 0;

            // 清除任何正在運行的動畫，防止多個動畫同時執行
            if (this.intervalId) {
                clearTimeout(this.intervalId);
            }

            // 遞歸顯示每個字，並根據隨機時間延遲顯示
            const showNextCharacter = () => {
                if (index < this.message.length) {
                    let delay;
                    const random = Math.random();

                    // 根據隨機數字決定顯示延遲時間
                    if (random < 0.75) {
                        delay = 200;   // 75%的機率顯示在0.2秒後
                    } else {
                        delay = 1000;  // 25%的機率顯示在1秒後
                    }

                    // 使用 setTimeout 來處理延遲顯示
                    this.intervalId = setTimeout(() => {
                        this.displayedMessage = this.message.slice(0, index + 1);
                        index++;
                        showNextCharacter();  // 顯示下一個字
                    }, delay);
                } else {
                    // 顯示完後停留2秒，再重新開始
                    setTimeout(() => {
                        this.displayedMessage = ""; // 清空文字
                        index = 0; // 重置索引
                        if (this.showMessage) {
                            this.startAnimation();  // 重新開始動畫
                        }
                    }, 2000);
                }
            };

            // 開始顯示第一個字
            showNextCharacter();
        }
    }
});

// 掛載 Vue 應用到 #app 元素
const vm = app.mount('#app');

// 將 Vue 實例暴露到全域變數
window.app = vm;
