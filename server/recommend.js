// 获取签名
const getSecuritySign = require('./sign');
const { getRandomVal, get } = require('./utils');
const { ERR_OK } = require('./constants');
// 注册推荐列表接口路由
function registerRecommend(app) {
    app.get('/api/getRecommend', (req, res) => {
        // 第三方服务接口
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

        // 构造请求data参数
        const data = JSON.stringify({
                comm: { ct: 24 },
                recomPlaylist: {
                    method: 'get_hot_recommend',
                    param: { async: 1, cmd: 2 },
                    module: 'playlist.HotRecommendServer'
                },
                focus: { module: 'music.musicHall.MusicHallPlatform', method: 'GetFocus', param: {} }
            })
            // 随机数值
        const ramdonVal = getRandomVal('recom');
        // 计算签名
        const sign = getSecuritySign(data);

        // 方式get请求
        get(url, {
            sign,
            '_': ramdonVal,
            data
        }).then(response => {
            // qq音乐接口请求结果
            const data = response.data;
            if (data.code === ERR_OK) {
                // // 轮播图数据
                const focusList = data.focus.data.shelf.v_niche[0].v_card;
                const sliders = [];
                const jumpPrefixMap = {
                        10002: 'https://y.qq.com/n/yqq/album/',
                        10014: 'https://y.qq.com/n/yqq/playlist/',
                        10012: 'https://y.qq.com/n/yqq/mv/v/'
                    }
                    // 获取最多10条数据
                const len = Math.min(focusList.length, 10);
                for (let i = 0; i < len; i++) {
                    const item = focusList[i];
                    // 封装轮播图数据结构
                    const { id /* id*/ , cover /*图片*/ } = item;
                    const sliderItem = {
                        id,
                        pic: cover,
                    };
                    if (jumpPrefixMap[item.jumptype]) { // 点击跳转的url
                        sliderItem.link = jumpPrefixMap[item.jumptype] + (item.subid || item.id) + '.html';
                    } else if (item.jumpPrefixMap === 3001) {
                        sliderItem.link = item.id;
                    }
                    sliders.push(sliderItem);
                }
                // // 推荐歌单数据
                const albumList = data.recomPlaylist.data.v_hot;
                const albums = [];
                for (let i = 0; i < albumList.length; i++) {
                    const item = albumList[i];
                    const { id /*id*/ , username /*用户名*/ , title /*标题*/ , cover /*图片*/ } = item;
                    const albumItem = {
                        id,
                        username,
                        title,
                        pic: cover
                    };
                    albums.push(albumItem);
                }

                // 封装为响应数据
                res.json({
                    code: ERR_OK,
                    result: {
                        sliders,
                        albums
                    }
                })
            } else {
                res.json(data);
            }
        })
    })
}

module.exports = registerRecommend;