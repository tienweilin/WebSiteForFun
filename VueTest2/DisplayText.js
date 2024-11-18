export default {
    props: ['text'], // 接收父元件傳遞的文字
    template: `
        <p style="cursor: default; color: black;">
            輸入的文字是：<strong>{{ text }}</strong>
        </p>
    `
};