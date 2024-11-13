// 建立 Vue 應用程式
const app = Vue.createApp({
    data() {
        return {
            days: '',
            hours: '',
            minutes: '',
            seconds: '',
            isValid: {
                days: true,
                hours: true,
                minutes: true,
                seconds: true,
            },
        };
    },
    computed: {
        formattedResult() {
            if (!this.isAllValid) return '請修正輸入錯誤';

            let totalSeconds =
                (parseInt(this.days) || 0) * 86400 +
                (parseInt(this.hours) || 0) * 3600 +
                (parseInt(this.minutes) || 0) * 60 +
                (parseInt(this.seconds) || 0);

            const days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;

            const hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;

            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            return `${days}日 ${hours}時 ${minutes}分 ${seconds}秒`;
        },
        isAllValid() {
            return this.isValid.days && this.isValid.hours && this.isValid.minutes && this.isValid.seconds;
        }
    },
    methods: {
        validateInput(field) {
            const value = this[field];
            // 更新正則表達式，允許 0 或正整數
            this.isValid[field] = /^(0|[1-9]\d*)$/.test(value) || value === '';
        }
    }
});

// 掛載 Vue 應用到 #app 元素
const vm = app.mount('#app');

// 將 Vue 實例暴露到全域變數
window.app = vm;
