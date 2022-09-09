const axios = require('axios');
const { commonParams, fallbackPicUrl } = require('./constants');

// 获取一个随机数值
function getRandomVal(prefix = '') {
    return prefix + (Math.random() + '').replace('0.', '')
}
// 获取一个随机 uid
function getUid() {
    const t = (new Date()).getUTCMilliseconds()
    return '' + Math.round(2147483647 * Math.random()) * t % 1e10
}
// 发送http请求
function get(url, params) {
    return axios.get(url, {
        headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com/'
        },
        params: Object.assign({}, commonParams, params)
    })
}
// 处理歌曲列表
function handleSongList(list) {
    const songList = []

    list.forEach((item) => {
        const info = item.songInfo || item
        if (info.pay.pay_play !== 0 || !info.interval) {
            // 过滤付费歌曲和获取不到时长的歌曲
            return
        }

        // 构造歌曲的数据结构
        const song = {
            id: info.id,
            mid: info.mid,
            name: info.name,
            singer: mergeSinger(info.singer),
            url: '', // 在另一个接口获取
            duration: info.interval,
            pic: info.album.mid ? `https://y.gtimg.cn/music/photo_new/T002R800x800M000${info.album.mid}.jpg?max_age=2592000` : fallbackPicUrl,
            album: info.album.name
        }

        songList.push(song)
    })

    return songList
}

// 合并多个歌手的姓名
function mergeSinger(singer) {
    const ret = []
    if (!singer) {
        return ''
    }
    singer.forEach((s) => {
        ret.push(s.name)
    })
    return ret.join('/')
}

// 对 axios post 请求的封装
// 修改请求的 headers 值
function post(url, params) {
    return axios.post(url, params, {
        headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com/',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

module.exports = {
    getRandomVal,
    getUid,
    get,
    post,
    handleSongList
}