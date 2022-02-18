// coba dulu aja, masi di kembangin, bagi yang ingin ngembangin silahkan

const Instagram = require('../lib/instagram-api')
const FileCookieStore = require('tough-cookie-filestore2')

let handler = async (m, { text}) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!q.download) throw 'reply gambarnya bwang!'
    let img = await q.download()
    if (!img) throw 'coba ulang commandnya, gambarnya rusak!'
    let wauser = global.db.data.users[m.sender]
    if (wauser.igusername=='') throw 'Login dulu bwang!,\ngimana mau prosses jalan kalo belum login\ncnth: *.instalogin username passwordnya*'
    if (wauser.igpassword=='') throw 'Login dulu bwang!,\ngimana mau prosses jalan kalo belum login\ncnth: *.instalogin username passwordnyas*'
    m.reply('sedang memproses, tunggu 1/2 menit!\nSabar bwang!')
    const cookieStore = new FileCookieStore(`./ig-${m.sender}.json`)
    const client = new Instagram({username: wauser.igusername, password: wauser.igpassword, cookieStore: cookieStore })
    let cekaut = await client.login()
    if (cekaut.authenticated== false) {
        wauser.igusername = ''
        wauser.igpassword = ''
        wauser.iglogined = false
        return m.reply('lu ganti passwornya?\n login lagi bwang!');
    } else {
        try {
            let media
            if (/video/.test(mime)) {
                media = await client.uploadVideo({ file: img, caption: text })
            } else if (/image/.test(mime)) {
                media = await client.uploadPhoto({ file: img, caption: text })
            } else {
                return m.reply('hanya menerima media image dan video saja bawng!')
            }
            let pesan = `*POST SUCCESS*\n
            - *URL*: https://www.instagram.com/p/${media.media.code}
            - *username*: @${media.media.user.username}
            - *fullname*: ${media.media.user.full_name}
            - *Caption*: ${text}`
            m.reply(pesan)
        } catch(e){
            m.reply('Error bwang baru di kembangin ini! :3')
        }
    }
}
    handler.help = ['instapost caption']
    handler.tags = ['instabot']
    handler.command = /^(instapost)$/i
    handler.igbot = true
    
    module.exports = handler