import InputWithDisplay from './InputWithDisplay.js';

const app = Vue.createApp({
    components: {
        'input-with-display': InputWithDisplay
    }
});

// 掛載 Vue 應用到 #app 元素
const vm = app.mount('#app');

// 將 Vue 實例暴露到全域變數
window.app = vm;
