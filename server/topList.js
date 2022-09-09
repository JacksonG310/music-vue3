const { getRandomVal, get } = require('./utils');
const getSecuritySign = require('./sign');
const { ERR_OK } = require('./constants');

// 注册排行榜接口
function registerTopList(app) {
    app.get('/api/getTopList', (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

        const data = JSON.stringify({
            comm: { ct: 24 },
            toplist: { module: 'musicToplist.ToplistInfoServer', method: 'GetAll', param: {} }
        })

        const randomKey = getRandomVal('recom')
        const sign = getSecuritySign(data)

        get(url, {
            sign,
            '-': randomKey,
            data
        }).then((response) => {
            const data = response.data
            if (data.code === ERR_OK) {
                const topList = []
                const group = data.toplist.data.group

                group.forEach((item) => {
                    item.toplist.forEach((listItem) => {
                        topList.push({
                            id: listItem.topId,
                            pic: listItem.frontPicUrl,
                            name: listItem.title,
                            period: listItem.period,
                            songList: listItem.song.map((songItem) => {
                                return {
                                    id: songItem.songId,
                                    singerName: songItem.singerName,
                                    songName: songItem.title
                                }
                            })
                        })
                    })
                })

                res.json({
                    code: ERR_OK,
                    result: {
                        topList
                    }
                })
            } else {
                res.json(data)
            }
        })
    })
}
module.exports = registerTopList