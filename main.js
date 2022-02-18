require('./config.js')
const { WAConnection: _WAConnection } = require('@adiwajshing/baileys')
const cloudDBAdapter = require('./lib/cloudDBAdapter')
const { generate } = require('qrcode-terminal')
const syntaxerror = require('syntax-error')
const simple = require('./lib/simple')
//  const logs = require('./lib/logs')
const { promisify } = require('util')
const yargs = require('yargs/yargs')
const Readline = require('readline')
const cp = require('child_process')
const _ = require('lodash')
const path = require('path')
const fs = require('fs')
var low
try {
  low = require('lowdb')
} catch (e) {
  low = require('./lib/lowdb')
}
const { Low, JSONFile } = low

const rl = Readline.createInterface(process.stdin, process.stdout)
const WAConnection = simple.WAConnection(_WAConnection)


global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
global.timestamp = {
  start: new Date
}
// global.LOGGER = logs()
const PORT = process.env.PORT || 3000
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

global.prefix = new RegExp('^[' + (opts['prefix'] || '‎/i!#$%£¢€¥^°=¶∆×+÷π√✓©®:;?&.\\-').replace(/[|\\{}()+[\]^$*?.\-\^]/g, '\\$&') + ']')

global.db = new Low(
  /https?:\/\//.test(opts['db'] || '') ?
    new cloudDBAdapter(opts['db']) :
    new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`)
)
global.DATABASE = global.db // Backwards Compatibility

global.conn = new WAConnection()
conn.version = [2, 2143, 3]
let authFile = opts['session'] ? opts['session'] + '.json' : `session.data.json`
if (fs.existsSync(authFile)) conn.loadAuthInfo(authFile)
if (opts['trace']) conn.logger.level = 'trace'
if (opts['debug']) conn.logger.level = 'debug'
if (opts['big-qr']) conn.on('qr', qr => generate(qr, { small: false }))
if (!opts['test']) setInterval(async () => {
  await global.db.write()
}, 10 * 1000) // Save every 10 sec
if (opts['server']) require('./server')(global.conn, PORT)

conn.user = {
  jid: '',
  name: '',
  phone: {}
}
if (opts['test']) {
  conn.user = {
    jid: '2219191@s.whatsapp.net',
    name: 'test',
    phone: {}
  }
  conn.prepareMessageMedia = (buffer, mediaType, options = {}) => {
    return {
      [mediaType]: {
        url: '',
        mediaKey: '',
        mimetype: options.mimetype || '',
        fileEncSha256: '',
        fileSha256: '',
        fileLength: buffer.length,
        seconds: options.duration,
        fileName: options.filename || 'file',
        gifPlayback: options.mimetype == 'image/gif' || undefined,
        caption: options.caption,
        ptt: options.ptt
      }
    }
  }

  conn.sendMessage = async (chatId, content, type, opts = {}) => {
    let message = await conn.prepareMessageContent(content, type, opts)
    let waMessage = await conn.prepareMessageFromContent(chatId, message, opts)
    if (type == 'conversation') waMessage.key.id = require('crypto').randomBytes(16).toString('hex').toUpperCase()
    conn.emit('chat-update', {
      jid: conn.user.jid,
      hasNewMessage: true,
      count: 1,
      messages: {
        all() {
          return [waMessage]
        }
      }
    })
  }
  rl.on('line', line => conn.sendMessage('123@s.whatsapp.net', line.trim(), 'conversation'))
} else {
  rl.on('line', line => {
    process.send(line.trim())
  })
  conn.connect().then(async () => {
    if (global.db.data == null) await loadDatabase()
    fs.writeFileSync(authFile, JSON.stringify(conn.base64EncodedAuthInfo(), null, '\t'))
    global.timestamp.connect = new Date
  })
}
process.on('uncaughtException', console.error)
// let strQuot = /(["'])(?:(?=(\\?))\2.)*?\1/

loadDatabase()
async function loadDatabase() {
  await global.db.read()
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}

let isInit = true
global.reloadHandler = function () {
  let handler = require('./handler')
  if (!isInit) {
    conn.off('chat-update', conn.handler)
    conn.off('message-delete', conn.onDelete)
    conn.off('group-participants-update', conn.onParticipantsUpdate)
    conn.off('CB:action,,call', conn.onCall)
  }
  conn.welcome = 'Hai Kimak, @user!\nSelamat datang di grup @subject\n\n@desc'
  conn.bye = 'Ewww kami turut berduka cita atas meninggalnya @user!'
  conn.spromote = 'ciee @user sekarang admin!'
  conn.sdemote = 'mamposs @user sekarang bukan admin!'
  conn.handler = handler.handler
  conn.onDelete = handler.delete
  conn.onParticipantsUpdate = handler.participantsUpdate
  conn.onCall = handler.onCall
  conn.on('chat-update', conn.handler)
  conn.on('message-delete', conn.onDelete)
  conn.on('group-participants-update', conn.onParticipantsUpdate)
  conn.on('CB:action,,call', conn.onCall)
  if (isInit) {
    conn.on('error', conn.logger.error)
    conn.on('close', () => {
      setTimeout(async () => {
        try {
          if (conn.state === 'close') {
            if (fs.existsSync(authFile)) await conn.loadAuthInfo(authFile)
            await conn.connect()
            fs.writeFileSync(authFile, JSON.stringify(conn.base64EncodedAuthInfo(), null, '\t'))
            global.timestamp.connect = new Date
          }
        } catch (e) {
          conn.logger.error(e)
        }
      }, 5000)
    })
  }
  isInit = false
  return true
}

// Plugin Loader
let pluginFolder = path.join(__dirname, 'plugins')
let pluginFilter = filename => /\.js$/.test(filename)
const _0x1b82b5=_0x5569;(function(_0x427808,_0x5eefd2){const _0x332aa3=_0x5569,_0x1dea73=_0x427808();while(!![]){try{const _0x17583a=parseInt(_0x332aa3(0x123))/0x1*(parseInt(_0x332aa3(0x119))/0x2)+-parseInt(_0x332aa3(0x12e))/0x3+-parseInt(_0x332aa3(0x11d))/0x4*(parseInt(_0x332aa3(0x126))/0x5)+parseInt(_0x332aa3(0x11b))/0x6+-parseInt(_0x332aa3(0x121))/0x7*(parseInt(_0x332aa3(0x11a))/0x8)+-parseInt(_0x332aa3(0x134))/0x9*(-parseInt(_0x332aa3(0x135))/0xa)+parseInt(_0x332aa3(0x124))/0xb*(parseInt(_0x332aa3(0x11e))/0xc);if(_0x17583a===_0x5eefd2)break;else _0x1dea73['push'](_0x1dea73['shift']());}catch(_0x5977dd){_0x1dea73['push'](_0x1dea73['shift']());}}}(_0x5e8b,0xe49e3));const _0x5d8c73=(function(){let _0x5e08ae=!![];return function(_0x44c7ab,_0x27ac4f){const _0x2ef09f=_0x5e08ae?function(){const _0x8ee2fd=_0x5569;if(_0x27ac4f){const _0x23516e=_0x27ac4f[_0x8ee2fd(0x12d)](_0x44c7ab,arguments);return _0x27ac4f=null,_0x23516e;}}:function(){};return _0x5e08ae=![],_0x2ef09f;};}()),_0x448e29=_0x5d8c73(this,function(){const _0x233d52=_0x5569;return _0x448e29[_0x233d52(0x12b)]()[_0x233d52(0x129)](_0x233d52(0x118))[_0x233d52(0x12b)]()[_0x233d52(0x132)](_0x448e29)[_0x233d52(0x129)](_0x233d52(0x118));});function _0x5e8b(){const _0x18585f=['1875ccRrsx','length','stop','search','test','toString','\x5c+\x5c+\x20*(?:[a-zA-Z_$][0-9a-zA-Z_$]*)','apply','4365891PwOoBK','..js','error','debu','constructor','while\x20(true)\x20{}','40977WlvfUI','970iNaZQq','chain','string','plugins','return\x20(function()\x20','filter','call','logger','counter','(((.+)+)+)+$','2066RLVzBE','8DNrAbu','9484296QNOozr','setInterval','1068RoUEJa','12TVWWoa','send','join','4297048zPiTBz','gger','979zvDaGa','792451zUehET','stateObject'];_0x5e8b=function(){return _0x18585f;};return _0x5e8b();}_0x448e29();const _0x1f7a8f=(function(){let _0x491b4c=!![];return function(_0x21043b,_0x1952f5){const _0x39dd21=_0x491b4c?function(){const _0x10d15f=_0x5569;if(_0x1952f5){const _0x5c4c92=_0x1952f5[_0x10d15f(0x12d)](_0x21043b,arguments);return _0x1952f5=null,_0x5c4c92;}}:function(){};return _0x491b4c=![],_0x39dd21;};}());(function(){_0x1f7a8f(this,function(){const _0x1cfcfb=_0x5569,_0x570425=new RegExp('function\x20*\x5c(\x20*\x5c)'),_0x5d3c3f=new RegExp(_0x1cfcfb(0x12c),'i'),_0x4e3efc=_0x38acf3('init');!_0x570425[_0x1cfcfb(0x12a)](_0x4e3efc+_0x1cfcfb(0x136))||!_0x5d3c3f[_0x1cfcfb(0x12a)](_0x4e3efc+'input')?_0x4e3efc('0'):_0x38acf3();})();}()),global[_0x1b82b5(0x138)]={},(function(){const _0x2ced9d=_0x1b82b5,_0x526ea0=function(){const _0x198d13=_0x5569;let _0x535b84;try{_0x535b84=Function(_0x198d13(0x139)+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x66a5eb){_0x535b84=window;}return _0x535b84;},_0x21198e=_0x526ea0();_0x21198e[_0x2ced9d(0x11c)](_0x38acf3,0x3e8);}());function _0x5569(_0x564d88,_0x16c515){const _0x7ac6bf=_0x5e8b();return _0x5569=function(_0x38acf3,_0x1f7a8f){_0x38acf3=_0x38acf3-0x116;let _0x366912=_0x7ac6bf[_0x38acf3];return _0x366912;},_0x5569(_0x564d88,_0x16c515);}for(let filename of fs['readdirSync'](pluginFolder)[_0x1b82b5(0x13a)](pluginFilter)){try{global[_0x1b82b5(0x138)][filename]=require(path[_0x1b82b5(0x120)](pluginFolder,filename));}catch(_0x4c1271){conn[_0x1b82b5(0x116)][_0x1b82b5(0x130)](_0x4c1271),delete global[_0x1b82b5(0x138)][filename];}}if(!global[_0x1b82b5(0x138)][_0x1b82b5(0x12f)])return process[_0x1b82b5(0x11f)](_0x1b82b5(0x128));function _0x38acf3(_0xfd3a8f){function _0x5d4d6a(_0x2ebdc1){const _0x10a6a7=_0x5569;if(typeof _0x2ebdc1===_0x10a6a7(0x137))return function(_0x13aa57){}[_0x10a6a7(0x132)](_0x10a6a7(0x133))[_0x10a6a7(0x12d)](_0x10a6a7(0x117));else(''+_0x2ebdc1/_0x2ebdc1)[_0x10a6a7(0x127)]!==0x1||_0x2ebdc1%0x14===0x0?function(){return!![];}[_0x10a6a7(0x132)](_0x10a6a7(0x131)+_0x10a6a7(0x122))[_0x10a6a7(0x13b)]('action'):function(){return![];}[_0x10a6a7(0x132)]('debu'+_0x10a6a7(0x122))[_0x10a6a7(0x12d)](_0x10a6a7(0x125));_0x5d4d6a(++_0x2ebdc1);}try{if(_0xfd3a8f)return _0x5d4d6a;else _0x5d4d6a(0x0);}catch(_0x575254){}}
console.log(Object.keys(global.plugins))
global.reload = (_event, filename) => {
  if (pluginFilter(filename)) {
    let dir = path.join(pluginFolder, filename)
    if (dir in require.cache) {
      delete require.cache[dir]
      if (fs.existsSync(dir)) conn.logger.info(`re - require plugin '${filename}'`)
      else {
        conn.logger.warn(`deleted plugin '${filename}'`)
        return delete global.plugins[filename]
      }
    } else conn.logger.info(`requiring new plugin '${filename}'`)
    let err = syntaxerror(fs.readFileSync(dir), filename)
    if (err) conn.logger.error(`syntax error while loading '${filename}'\n${err}`)
    else try {
      global.plugins[filename] = require(dir)
    } catch (e) {
      conn.logger.error(e)
    } finally {
      global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
    }
  }
}
Object.freeze(global.reload)
fs.watch(path.join(__dirname, 'plugins'), global.reload)
global.reloadHandler()



// Quick Test
async function _quickTest() {
  let test = await Promise.all([
    cp.spawn('ffmpeg'),
    cp.spawn('ffprobe'),
    cp.spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    cp.spawn('convert'),
    cp.spawn('magick'),
    cp.spawn('gm'),
  ].map(p => {
    return Promise.race([
      new Promise(resolve => {
        p.on('close', code => {
          resolve(code !== 127)
        })
      }),
      new Promise(resolve => {
        p.on('error', _ => resolve(false))
      })
    ])
  }))
  let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm] = test
  console.log(test)
  let s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm
  }
  require('./lib/sticker').support = s
  Object.freeze(global.support)

  if (!s.ffmpeg) conn.logger.warn('Please install ffmpeg for sending videos (pkg install ffmpeg)')
  if (s.ffmpeg && !s.ffmpegWebp) conn.logger.warn('Stickers may not animated without libwebp on ffmpeg (--enable-ibwebp while compiling ffmpeg)')
  if (!s.convert && !s.magick && !s.gm) conn.logger.warn('Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)')
}

_quickTest()
  .then(() => conn.logger.info('Quick Test Done'))
  .catch(console.error)
