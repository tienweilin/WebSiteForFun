import DisplayText from './DisplayText.js';

export default {
    components: {
        'display-text': DisplayText
    },
    data() {
        return {
            inputText: '' // 儲存輸入框的值
        };
    },
    template: `
        <div style="margin-bottom: 20px;">
            <input v-model="inputText" type="text" placeholder="輸入文字" />
            <display-text :text="inputText"></display-text>
        </div>
    `
};