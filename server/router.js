const registerRecommend = require("./recommend");
const registerSingerList = require("./singerList");
const registerSingerDetail = require("./singerDetail");
const registerSongsUrl = require("./songURL");
const registerLyric = require("./songLyric");
const registerAlbum = require("./album");
const registerTopList = require('./topList');
const registerTopDetail = require('./topListDetail');
const registerHotKeys = require('./hotKeys');
const registerSearch = require('./search')
    // 注册后端路由
function registerRouter(app) {
    registerRecommend(app);
    registerSingerList(app);
    registerSingerDetail(app);
    registerSongsUrl(app);
    registerLyric(app);
    registerAlbum(app);
    registerTopList(app);
    registerSingerDetail(app);
    registerTopDetail(app);
    registerHotKeys(app);
    registerSearch(app);
}


module.exports = registerRouter