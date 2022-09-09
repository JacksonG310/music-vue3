const { getRandomVal, get } = require('./utils');
const { ERR_OK, token, commonParams } = require('./constants');

// 注册搜索查询接口
function registerSearch(app) {
    app.get('/api/search', (req, res) => {
        const url = `https://u.y.qq.com/cgi-bin/musics.fcg?_=${getRandomVal()}&sign=${sign}`

        const { query, page, showSinger } = req.query

        const data = {
            _: getRandomVal(),
            cv: 4747474,
            ct: 24,
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq.json',
            needNewCode: 1,
            uin: 0,
            g_tk_new_20200303: token,
            g_tk: token,
            hostUin: 0,
            is_xml: 0,
            key: query,
            p: page,
            perpage: 20,
            n: 20,
            zhidaqu: 1,
            catZhida: showSinger === 'true' ? 1 : 0,
            t: 0,
            flag: 1,
            ie: 'utf-8',
            sem: 1,
            aggr: 0,
            remoteplace: 'txt.mqq.all',
        }

        get(url, data).then((response) => {
            const data = response.data
            if (data.code === ERR_OK) {
                //     const songList = []
                //     const songData = data.data.song
                //     const list = songData.list

                //     list.forEach((item) => {
                //         const info = item
                //         if (info.pay.payplay !== 0 || !info.interval) {
                //             // 过滤付费歌曲
                //             return
                //         }

                //         const song = {
                //             id: info.songid,
                //             mid: info.songmid,
                //             name: info.songname,
                //             singer: mergeSinger(info.singer),
                //             url: '',
                //             duration: info.interval,
                //             pic: info.albummid ? `https://y.gtimg.cn/music/photo_new/T002R800x800M000${info.albummid}.jpg?max_age=2592000` : fallbackPicUrl,
                //             album: info.albumname
                //         }
                //         songList.push(song)
                //     })

                //     let singer
                //     const zhida = data.data.zhida
                //     if (zhida && zhida.type === 2) {
                //         singer = {
                //             id: zhida.singerid,
                //             mid: zhida.singermid,
                //             name: zhida.singername,
                //             pic: `https://y.gtimg.cn/music/photo_new/T001R800x800M000${zhida.singermid}.jpg?max_age=2592000`
                //         }
                //     }

                //     const { curnum, curpage, totalnum } = songData
                //     const hasMore = 20 * (curpage - 1) + curnum < totalnum

                res.json({
                    code: ERR_OK,
                    result: {
                        // songs: songList,
                        // singer,
                        // hasMore
                        data
                    }
                })
            } else {
                res.json(data)
            }
        })
    })
}

module.exports = registerSearch;