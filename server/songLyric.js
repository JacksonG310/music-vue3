const { token, ERR_OK } = require('./constants');
const { get } = require('./utils')
const { Base64 } = require('js-base64');
// 注册歌词接口
function registerLyric(app) {
    app.get('/api/getLyric', (req, res) => {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

        get(url, {
            '-': 'MusicJsonCallback_lrc',
            pcachetime: +new Date(),
            songmid: req.query.mid,
            g_tk_new_20200303: token
        }).then((response) => {
            const data = response.data
            if (data.code === ERR_OK) {
                res.json({
                    code: ERR_OK,
                    result: {
                        lyric: Base64.decode(data.lyric)
                    }
                })
            } else {
                res.json(data)
            }
        })
    })
}

module.exports = registerLyric;