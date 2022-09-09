const { default: axios } = require("axios");
const getSecuritySign = require('./sign');
const { getRandomVal } = require('./utils')

const token = 5381;
const commonParams = {
    g_tk: token,
    loginUin: 0,
    hostUin: 0,
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    needNewCode: 0,
    format: 'json',
    platform: 'yqq.json'
}


function get(url, params) {
    return axios.get(url, {
        headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com/'
        },
        params: Object.assign({}, commonParams, params)
    })
}

function post(url, data) {
    return axios.post(url, data, {
        headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com/',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
}

async function App() {
    const url = `https://u.y.qq.com/cgi-bin/musics.fcg`;


    const data = JSON.stringify({
        comm: { ct: 24 },
        recomPlaylist: {
            method: 'get_hot_recommend',
            param: { async: 1, cmd: 2 },
            module: 'playlist.HotRecommendServer'
        },
        focus: { module: 'music.musicHall.MusicHallPlatform', method: 'GetFocus', param: {} }
    })

    const randomVal = getRandomVal('romm');
    const sign = getSecuritySign(data)
    const res = await get(url, { sign, '-': randomVal, data });
    debugger;
    console.log(res.data);
}
App();