const { getRandomVal, get, handleSongList } = require('./utils');
const getSecuritySign = require('./sign');
const { ERR_OK } = require('./constants');

// 注册排行榜详情接口
function registerTopDetail(app) {
    app.get('/api/getTopDetail', (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
        const { id, period } = req.query

        const data = JSON.stringify({
            detail: {
                module: 'musicToplist.ToplistInfoServer',
                method: 'GetDetail',
                param: {
                    topId: Number(id),
                    offset: 0,
                    num: 100,
                    period
                }
            },
            comm: {
                ct: 24,
                cv: 0
            }
        })

        const randomKey = getRandomVal('getUCGI')
        const sign = getSecuritySign(data)

        get(url, {
            sign,
            '-': randomKey,
            data
        }).then((response) => {
            const data = response.data
            if (data.code === ERR_OK) {
                const list = data.detail.data.songInfoList
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

module.exports = registerTopDetail;