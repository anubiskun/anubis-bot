<!-- created by anubiskun -->
# 
[![website](https://img.shields.io/badge/-website-black.svg?style=for-the-badge&logo=firefoxbrowser&colorB=555)](https://www.anubiskun.xyz)
[![api rest](https://img.shields.io/badge/-api_rest-black.svg?style=for-the-badge&logo=firefoxbrowser&colorB=555)](https://www.api.anubiskun.xyz)
[![github](https://img.shields.io/badge/-Github-black.svg?style=for-the-badge&logo=github&colorB=555)](https://github.com/anubiskun)
[![telegram](https://img.shields.io/badge/-Telegram-black.svg?style=for-the-badge&logo=telegram&colorB=555)](https://t.me/anubiskun)
[![whatsapp](https://img.shields.io/badge/-Whatsapp-black.svg?style=for-the-badge&logo=whatsapp&colorB=555)](https://wa.me/6289653909054?text=hai,%20anubis)
![Profile views](https://gpvc.arturio.dev/anubiskun)
<!-- PROJECT LOGO -->

<br />
<p align="center">
  <a href="https://github.com/anubiskun/profile">
    <img src="https://github.com/anubiskun.png?size=250" alt="Logo" width="250px">
  </a>

  <h3 align="center">Profile</h3>

  <p align="center">
    <a href="https://www.anubiskun.xyz/"><strong>Explore the docs ?</strong></a>
    <br />
    <a href="https://t.me/anubiskun">Report Bug</a>
  </p>
</p>
<!-- isi content -->

# 
# added instabot
[new instabot include, tested!](https://github.com/anubiskun/anubis-bot/blob/b709a644956254d5345daa7d310f320c26b5e563/lib/instagram-api.js)

`- login cmd '.instalogin username password'`

`- post '.instapost caption|reply image/video'`

`- delete post '.instadel url'`

`- get profile '.instagetprofile'`
# anubis-bot

Simple WhatsApp Bot

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/anubiskun/anubis-bot)

## NEW JSON DATABASE FOR HEROKU
[![JSON DATABASE](https://img.shields.io/badge/-json_database-black.svg?style=for-the-badge&logo=github&colorB=555)](https://github.com/anubiskun/anubis-bot-database)
```
https://github.com/anubiskun/anubis-bot-database
```

## BOT WHATSAPP NUMBER
[![BOT WHATSAPP](https://img.shields.io/badge/-Number_WA_Bot-black.svg?style=for-the-badge&logo=whatsapp&colorB=555)](https://wa.me/6281282091206?text=.donasi)

## FOR TERMUX/UBUNTU/SSH USER

```bash
apt update && apt upgrade
apt install git -y
apt install nodejs -y
apt install ffmpeg -y
apt install imagemagick -y
git clone https://github.com/anubiskun/anubis-bot
cd anubis-bot
npm install
npm update
```

## INSTALL ON TERMUX WITH UBUNTU

[ INSTALLING UBUNTU ]

```bash
apt update && apt full-upgrade
apt install wget curl git proot-distro
proot-distro install ubuntu
echo "proot-distro login ubuntu" > $PREFIX/bin/ubuntu
ubuntu
```
---------

[ INSTALLING REQUIRED PACKAGES ]

```bash
ubuntu
apt update && apt full-upgrade
apt install wget curl git ffmpeg imagemagick build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev dbus-x11 ffmpeg2theora ffmpegfs ffmpegthumbnailer ffmpegthumbnailer-dbg ffmpegthumbs libavcodec-dev libavcodec-extra libavcodec-extra58 libavdevice-dev libavdevice58 libavfilter-dev libavfilter-extra libavfilter-extra7 libavformat-dev libavformat58 libavifile-0.7-bin libavifile-0.7-common libavifile-0.7c2 libavresample-dev libavresample4 libavutil-dev libavutil56 libpostproc-dev libpostproc55 graphicsmagick graphicsmagick-dbg graphicsmagick-imagemagick-compat graphicsmagick-libmagick-dev-compat groff imagemagick-6.q16hdri imagemagick-common libchart-gnuplot-perl libgraphics-magick-perl libgraphicsmagick++-q16-12 libgraphicsmagick++1-dev
```

---------

[ INSTALLING NODEJS & ANUBIS-BOT ]

```bash
ubuntu
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
apt install -y nodejs gcc g++ make
git clone https://github.com/anubiskun/anubis-bot
cd anubis-bot
npm install
npm update
```

---------

## FOR WINDOWS/VPS/RDP USER

* Download And Install Git [`Click Here`](https://git-scm.com/downloads)
* Download And Install NodeJS [`Click Here`](https://nodejs.org/en/download)
* Download And Install FFmpeg [`Click Here`](https://ffmpeg.org/download.html) (**Don't Forget Add FFmpeg to PATH enviroment variables**)
* Download And Install ImageMagick [`Click Here`](https://imagemagick.org/script/download.php)

```bash
git clone https://github.com/anubiskun/anubis-bot
cd anubis-bot
npm install
npm update
```

---------

## Run

```bash
node .
```

---------

## Arguments `node . [--options] [<session name>]`

### `--session <file name>`

Use another session with another name, default is ```session.data.json```

### `--prefix <prefixes>`

* `prefixes` are seperated by each character
Set prefix

### `--server`

Used for [heroku](https://heroku.com/) or scan through website

### `--db <json-server-url>`

Use external db instead of local db, 
## [ANUBIS-BOT-DATABASE](https://github.com/anubiskun/anubis-bot-database)

`node . --server --db 'https://database-botwa.herokuapp.com/anubis'`

The server should have like this specification

#### GET

```http
GET /
Accept: application/json
```

#### POST

```http
POST /
Content-Type: application/json
{
 data: {}
}
```

### `--big-qr`

If small qr unicode doesn't support

### `--img`

Enable image inspector through terminal

### `--test`

**Development** Testing Mode

### `--trace`

```js
conn.logger.level = 'trace'
```

### `--debug`

```js
conn.logger.level = 'debug'
```

## Settings

Now set using switch [enable.js](https://github.com/anubiskun/anubis-bot/blob/master/plugins/enable.js), among others are

```js
anticall: false, // Auto Reject better than autoblock
autoread: false, // If true all chats are automatically read
nyimak: false, // No bot, just print received messages and add users to database
restrict: false, // Enables restricted plugins (which can lead your number to be banned if used too often)
self: false, // Activate self mode (Ignores other)
pconly: false, // If that chat not from private bot, bot will ignore
gconly: false, // If that chat not from group, bot will ignore
jadibot: false, 
```

---------

[![Nurutomo](https://github.com/Nurutomo.png?size=100)](https://github.com/Nurutomo) | [![Anubis](https://github.com/anubiskun.png?size=100)](https://github.com/anubiskun)
----|----
[Nurutomo](https://github.com/Nurutomo) | [anubiskun](https://github.com/anubiskun)
Author / Creator | Rewrite / Recode


Best Regards. wabot-aq