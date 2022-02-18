const Pageres = require('pageres')

let handler = async (m, { conn, args }) => {
  let url = args[0];
  let aa = /https?:\/\//g.test(url)
  if (!aa) return m.reply('httpsnya mana? harusnya gini :\nhttps://' + args[0])
  m.reply('tunggu sebentar bwang sabar ya!')
  let a = await new Pageres({delay: 2})
  .src(url, ['1024x768'], {crop: false})
  .dest('./views/img')
  .run();
  conn.sendFile(m.chat, './views/img/' + a[0].filename, a[0].filename, '© anubis-bot', m)
}
handler.help = ['ss', 'ssf'].map(v => v + ' url')
handler.tags = ['internet']
handler.command = /^ss(web)?f?$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.limit = true
handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler

