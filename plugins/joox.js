const { joox } = require('../lib/scrape_joox')
const fetch = require('node-fetch')
const axios = require("axios")

const isUrl = str => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi.test(str)
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Perintah ini untuk mendownload lagu joox berdasarkan url*\n\ncontoh:\n${usedPrefix + command} https://www.joox.com/id/single/X4_JLatiqHfi6UVPfmLTPA==`
    if (!isUrl(text)) throw `*Perintah ini untuk mendownload lagu joox berdasarkan url*\n\ncontoh:\n${usedPrefix + command} https://www.joox.com/id/single/X4_JLatiqHfi6UVPfmLTPA==\n\nJika Link yang anda masukan error coba hubungi owner`
    const getidJoox = text.match(/https?:\/\/(www\.)?joox\.[a-z]+\/[a-z]+\/\w+\/([-a-zA-Z0-9()@:%_+.~#?&/=]*)/)
    let jjson = await joox(getidJoox[2])
    let json = jjson.data[Math.floor(Math.random() * jjson.data.length)]
    if (json==null) return m.reply('error lagu ga bisa di download!')
    let pesan = `
*Penyanyi:* ${json.msinger}
*Judul:* ${json.msong}
*Album:* ${json.malbum}
*Diterbitkan:* ${json.public_time}
*Link:* ${await shortlink(json.mp3Url)}
`.trim()
    conn.sendButtonImg(m.chat, json.imgSrc, pesan, '© anubis-bot', 'Lyric', `${usedPrefix}jlll ${text}`, m, { thumbnail: json.imgSrc, height: 500, width: 500 })
    conn.sendFile(m.chat, json.mp3Url, 'anubis-bot.mp3', '', m, false, { mimetype: 'audio/mp4' })
}

handler.help = ['joox'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(joox|jxdl)$/i
handler.limit = true
module.exports = handler

async function shortlink(url) {
    isurl = /https?:\/\//.test(url)
    return isurl ? (await require('axios').get('https://tinyurl.com/api-create.php?url='+encodeURIComponent(url))).data : ''
    }