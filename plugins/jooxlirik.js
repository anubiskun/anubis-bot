const { lirik } = require('../lib/scrape_joox')

// const isUrl = str => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi.test(str)
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Perintah ini untuk mencari lyric dengan url\n*TIDAK DI RECOMENDASIKAN DI GUNAKAN DI COMMAND*\ngunakan command jooxlyric/jl\n\ncontoh:\n${usedPrefix + command} https://www.joox.com/id/single/X4_JLatiqHfi6UVPfmLTPA==`
    if (!isUrl(text)) throw `Perintah ini untuk mencari lyric dengan url\n*TIDAK DI RECOMENDASIKAN DI GUNAKAN DI COMMAND*\ngunakan command jooxlyric/jl\n\ncontoh:\n${usedPrefix + command} https://www.joox.com/id/single/X4_JLatiqHfi6UVPfmLTPA==`
    const getidJoox = text.match(/https?:\/\/(www\.)?joox\.[a-z]+\/[a-z]+\/\w+\/([-a-zA-Z0-9()@:%_+.~#?&/=]*)/)
    let jjson = await lirik(getidJoox[2])
    let json = jjson.data[Math.floor(Math.random() * jjson.data.length)]
    m.reply(json.lyric)
}

handler.help = ['jl', 'jooxlyric'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(jlll)$/i
handler.owner = true
module.exports = handler