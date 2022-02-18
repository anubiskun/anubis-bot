const fs = require('fs')
const { spawn } = require('child_process')
const { getVideoDurationInSeconds } = require('get-video-duration')
const ms = require('millisecond');
const sizeOf = require('image-size')

function ffmpeg(buffer, args = [], ext = '') {
  return new Promise(async (resolve, reject) => {
    try {
      let tmp = `./tmp/${Date.now()}`
      let out = tmp + '.' + ext
      await fs.promises.writeFile(tmp, buffer)
      spawn('ffmpeg', [
        '-i', tmp,
        ...args,
        out
      ])
        .on('error', reject)
        .on('close', async (code) => {
          try {
            await fs.promises.unlink(tmp)
            if (code !== 0) return reject(code)
            if (ext=='mp4'){
              let dur = await getVideoDurationInSeconds(out).then((duration) => {
                return duration
              })
              let durasi = ms(`${dur} second`)
              let video = await fs.promises.readFile(out);
              resolve({
                video: video,
                durasi: durasi,
              })
            } else {
              let size = await sizeOf(out);
              let file = await fs.promises.readFile(out)
              resolve({
                file: file,
                height: size.height,
                width: size.width,
              })
            }
            await fs.promises.unlink(out)
          } catch (e) {
            reject(e)
          }
        })
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * by anubiskun.xyz
 * @param {Buffer} buffer Video Buffer
 */
 function cVideo(buffer) {
   let promoses = []
  return new Promise(async (resolve, reject) => {
    try {
      let {video, durasi} = await ffmpeg(buffer, [
        '-vf', `scale=w=720:h=720:force_original_aspect_ratio=decrease,pad=w=720:h=720:x=(iw-ow):y=(ih-oh):color=white`,
        '-vcodec', 'libx264',
        '-profile:v', 'high', '-level:v', '4.0',
        '-c:a', 'aac',
        '-preset', 'slow',
        '-crf', '28'
      ], 'mp4');
      let {file, width, height} = await ffmpeg(video, [
        '-ss', '00:00:03',
        '-vframes', '1',
        '-f', 'image2',
      ], 'jpg');
      Promise.all(promoses).then(() => resolve({
        video: video,
        durasi: durasi,
        thumb: file,
        width: width,
        height: height,
    }))
  } catch (e) {
    reject(e)
  }
  })
}

/**
 * by anubiskun.xyz
 * @param {Buffer} buffer image Buffer
 */
 function cFotoScale(buffer) {
   let promoses = []
  return new Promise(async (resolve, reject) => {
    try {
      let {file, width, height} = await ffmpeg(buffer, [
        '-vf', `scale=w=640:h=640:force_original_aspect_ratio=decrease,pad=w=640:h=640:x=(iw-ow):y=(ih-oh):color=white`
      ], 'jpg');  
      Promise.all(promoses).then(() => resolve({
        file: file,
        width: width,
        height: height,
    }))
  } catch (e) {
    reject(e)
  }
  })
}

module.exports = {
  ffmpeg,
  cVideo,
  cFotoScale,
}

