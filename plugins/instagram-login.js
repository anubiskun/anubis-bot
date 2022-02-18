// coba dulu aja, masi di kembangin, bagi yang ingin ngembangin silahkan

const Instagram = require('../lib/instagram-api')
const client = new Instagram({ username: '', password: '' })

let handler = async function (m, { text, usedPrefix }) {
    let user = global.db.data.users[m.sender]
    if (user.iglogined === true) throw `Anda sudah Login!`
    let Reg = /^(.+)( )(.+)$/i
    if (!Reg.test(text)) throw `Format salah\n${usedPrefix}instalogin *username password*`
    let [username, password] = text.split(' ')
    let login
    if (username){
        login = await client.login({ username: username, password: password })
    } else {
        throw 'hayoo mau hek ya :v'
    }
    if (login.showAccountRecoveryModal==true) {
        m.reply('banyak kali kau coba password\n username bener tapi lupa passwordnya?\nrecovery tu sono')
    } else if (login.user==true || login.authenticated==true){
        user.igusername = username
        user.igpassword = password
        user.igregTime = + new Date
        user.iglogined = true
        m.reply(`Selamat login berhasil!`)
    } else if ( login.authenticated==false || login.user==true ) {
        m.reply('user benar, pass salah coba teliti lagi bwang!')
    } else if (login.user==false || login.authenticated==false) {
        m.reply('user salah, pass salah coba teliti lagi bwang!')
    }
}
handler.help = ['instalogin username password']
handler.tags = ['instabot']

handler.command = /^(instalogin)$/i

module.exports = handler

