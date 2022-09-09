const ERR_OK = 0;
const token = 5381;
// 歌曲图片加载失败时使用的默认图片
const fallbackPicUrl = 'https://y.gtimg.cn/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000'
    // 公共参数
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

module.exports = {
    ERR_OK,
    token,
    commonParams,
    fallbackPicUrl
}