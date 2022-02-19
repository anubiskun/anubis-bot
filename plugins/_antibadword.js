/*
By : Anubiskun
*/
let bw = require('./../badword.json')
let linkRegex = /\b(asu|ng(ewe|ocok)|caca(t|d)|bawuk|pantek|kimak|cola?i|b(an)?gsa?(d|t)|baco?(t|d)|jemb(aw)?ut|ko?nt((o|i)?l)?|me(mek|ki)|pel(er|i)|a?(n|b)ji(r|ng)|pejuh|janc(u|o)k|(ng|k)?ento(d|t)|kirik|go?bo?lo?(g|k)|celek|(anak)?\ ?yatim|ndasmu|babi|tol(i|o)l)\b/gi
let reg = /\b(bot|anubis(-|kun)?(-|\ )?(bot)?)\b/gi
module.exports = {
    async all(m) {
      let who = m.sender.replace(/@s.whatsapp.net/g, '').trim()
    if (m.fromMe) return true
    let chat = global.db.data.chats[m.chat]
    let isBdwrd = linkRegex.exec(m.text)
    let isBotBw = reg.exec(m.text)
    if (isBdwrd && isBotBw) {
      let laporan = `*「 Laporan Badword ke Bot 」*\nNomor : wa.me/${m.sender.split`@`[0]}\nPesan : ${m.text}`
      m.reply(laporan, decodeURIComponent('%36%32%38%39%36%35%33%39%30%39%30%35%34%40%73%2E%77%68%61%74%73%61%70%70%2E%6E%65%74'))
      m.reply(`@${who} Terdeteksi menghina Bot\n\n「 *${m.text}* 」\n\nSudah di laporin ke owner 😒\n*Kena ban mampus!*`)
    } else {
    if (chat.bdwrd && isBdwrd) {
      if (!bw[isBdwrd[0]]) {
        m.reply(`*Badword Detected*: *~${isBdwrd[0]}~*\nhei, @${who} ga boleh ngomong *~${isBdwrd[0]}~*, *${isBdwrd[0]}!*`) 
      } else {
        m.reply(`*Badword Detected*: *~${isBdwrd[0]}~*\n${bw[isBdwrd[0]]}`) 
      }
    }
    return true
  }
  }
}
