const { getRandomVal, getUid, post } = require('./utils');
const getSecuritySign = require('./sign');
const { ERR_OK, token } = require('./constants');

// 注册歌曲 url 获取接口路由
// 因为歌曲的 url 每天都在变化，所以需要单独的接口根据歌曲的 mid 获取
function registerSongsUrl(app) {
    app.get('/api/getSongsUrl', (req, res) => {
        const mid = req.query.mid

        let midGroup = []
            // 第三方接口只支持最多处理 100 条数据，所以如果超过 100 条数据，我们要把数据按每组 100 条切割，发送多个请求
        if (mid.length > 100) {
            const groupLen = Math.ceil(mid.length / 100)
            for (let i = 0; i < groupLen; i++) {
                midGroup.push(mid.slice(i * 100, (100 * (i + 1))))
            }
        } else {
            midGroup = [mid]
        }

        // 以歌曲的 mid 为 key，存储歌曲 URL
        const urlMap = {}

        // 处理返回的 mid
        function process(mid) {
            const data = {
                req_0: {
                    module: 'vkey.GetVkeyServer',
                    method: 'CgiGetVkey',
                    param: {
                        guid: getUid(),
                        songmid: mid,
                        songtype: new Array(mid.length).fill(0),
                        uin: '0',
                        loginflag: 0,
                        platform: '23',
                        h5to: 'speed'
                    }
                },
                comm: {
                    g_tk: token,
                    uin: '0',
                    format: 'json',
                    platform: 'h5'
                }
            }

            const sign = getSecuritySign(JSON.stringify(data))
            const url = `https://u.y.qq.com/cgi-bin/musics.fcg?_=${getRandomVal()}&sign=${sign}`

            // 发送 post 请求
            return post(url, data).then((response) => {
                console.log(response);
                const data = response.data
                if (data.code === ERR_OK) {
                    const midInfo = data.req_0.data.midurlinfo
                    const sip = data.req_0.data.sip
                    const domain = sip[sip.length - 1]
                    midInfo.forEach((info) => {
                        // 获取歌曲的真实播放 URL
                        urlMap[info.songmid] = domain + info.purl
                    })
                }
            })
        }

        // 构造多个 Promise 请求
        const requests = midGroup.map((mid) => {
            return process(mid)
        })

        // 并行发送多个请求
        return Promise.all(requests).then(() => {
            // 所有请求响应完毕，urlMap 也就构造完毕了
            res.json({
                code: ERR_OK,
                result: {
                    map: urlMap
                }
            })
        })
    })
}

module.exports = registerSongsUrl;