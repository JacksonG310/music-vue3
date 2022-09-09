const { get } = require('./utils');
const { ERR_OK, token } = require('./constants');
// 注册热门搜索接口
function registerHotKeys(app) {
    app.get('/api/getHotKeys', (req, res) => {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

        get(url, {
            g_tk_new_20200303: token
        }).then((response) => {
            const data = response.data
            console.log(data);
            if (data.code === ERR_OK) {
                res.json({
                    code: ERR_OK,
                    result: {
                        hotKeys: data.data.hotkey.map((key) => {
                            return {
                                key: key.k,
                                id: key.n
                            }
                        }).slice(0, 10)
                    }
                })
            } else {
                res.json(data)
            }
        })
    })
}

module.exports = registerHotKeys;