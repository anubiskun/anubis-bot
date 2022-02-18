// coba dulu aja, masi di kembangin, bagi yang ingin ngembangin silahkan

const Instagram = require('../lib/instagram-api')
const FileCookieStore = require('tough-cookie-filestore2')
// const client = new Instagram({username, password})

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `mana urlnya?\ncnth commandnya : \n${usedPrefix + command} https://www.instagram.com/p/CZy_dB_DaGd/`
    let wauser = global.db.data.users[m.sender]
    if (wauser.igusername=='') throw 'Login dulu bwang!,\ngimana mau prosses jalan kalo belum login\ncnth: *.instalogin*'
    if (wauser.igpassword=='') throw 'Login dulu bwang!,\ngimana mau prosses jalan kalo belum login\ncnth: *.instalogin*'
    const cookieStore = new FileCookieStore(`./ig-${m.sender}.json`)
    const client = new Instagram({cookieStore: cookieStore })
    await client.login()
    if (!/instagram\.com/i.test(text)) throw `mana urlnya?\ncnth commandnya : \n${usedPrefix + command} https://www.instagram.com/p/CZy_dB_DaGd/`
    let sc = /(?:https?:\/\/)?(?:www.)?instagram.com\/?([a-zA-Z0-9\.\_\-]+)?\/([p]+)?([reel]+)?([tv]+)?([stories]+)?\/([a-zA-Z0-9\-\_\.]+)\/?([0-9]+)?/i.exec(text)
    let a = await client.getMediaByShortcode({ shortcode: sc[6] })
    let b = await client.deleteMedia({ mediaId: a.id })
    if (b.did_delete==true){
        m.reply('postingan berhasil di delete!')
    } else {
        m.reply('postingan gagal di delete bwang!')
    }
}
    handler.help = ['instadel url']
    handler.tags = ['instabot']
    handler.command = /^(instadel)$/i
    handler.igbot = true
    
    module.exports = handler