const registerRecommend = require("./recommend");
const registerSingerList = require("./singerList");
const registerSingerDetail = require("./singerDetail");
const registerSongsUrl = require("./songURL");
const registerLyric = require("./songLyric");
// 注册后端路由
function registerRouter(app) {
    registerRecommend(app);
    registerSingerList(app);
    registerSingerDetail(app);
    registerSongsUrl(app);
    registerLyric(app);
}


module.exports = registerRouter