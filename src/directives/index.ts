import { App } from "vue";
export default {
    install(app: App) {
        // 全局注册指令
        const drecRequire = require.context('./modules', false, /\.ts$/);
        drecRequire.keys().forEach((key) => {
            const name = key.replace('./', '').split('.')[0];
            app.directive(name, drecRequire(key).default);
        })
    }
}