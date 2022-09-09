const { getRandomVal, get, handleSongList } = require('./utils');
const getSecuritySign = require('./sign');
const { ERR_OK } = require('./constants');

// 注册歌手详情接口路由
function registerSingerDetail(app) {
    app.get('/api/getSingerDetail', (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

        const data = JSON.stringify({
            comm: { ct: 24, cv: 0 },
            singerSongList: {
                method: 'GetSingerSongList',
                param: { order: 1, singerMid: req.query.mid, begin: 0, num: 100 },
                module: 'musichall.song_list_server'
            }
        })

        const randomKey = getRandomVal('getSingerSong')
        const sign = getSecuritySign(data)

        get(url, {
            sign,
            '-': randomKey,
            data
        }).then((response) => {
            const data = response.data
            if (data.code === ERR_OK) {
                const list = data.singerSongList.data.songList
                    // 歌单详情、榜单详情接口都有类似处理逻辑，固封装成函数
                const songList = handleSongList(list)
                res.json({
                    code: ERR_OK,
                    result: {
                        songs: songList
                    }
                })
            } else {
                res.json(data)
            }
        })
    })
}


module.exports = registerSingerDetail;