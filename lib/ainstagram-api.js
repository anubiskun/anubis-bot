// Warning! don't change anything bellow.

const fs = require('fs')
const crypto = require('crypto')
const {cVideo, cFotoScale} = require('./igconvert')
const request = require('request-promise-native')
const { Cookie } = require('tough-cookie')
const isUrl = require('is-url')
const useragentFromSeed = require('useragent-from-seed')
const baseUrl = 'https://www.instagram.com'
class Instagram {
  constructor(
    { username, password, cookieStore },
    { language, proxy, requestOptions } = {}
  ) {
    this.credentials = {
      username,
      password
    }
    const jar = request.jar(cookieStore)
    jar.setCookie(request.cookie('ig_cb=1'), baseUrl)
    const { value: csrftoken } =
      jar.getCookies(baseUrl).find(({ key }) => key === 'csrftoken') || {}
    const userAgent = useragentFromSeed(username)
    if (requestOptions === undefined) {
      requestOptions = {}
    }
    requestOptions.baseUrl = baseUrl
    requestOptions.uri = ''
    requestOptions.headers = {
      'User-Agent': userAgent,
      'Accept-Language': language || 'en-US',
      'X-Instagram-AJAX': 1,
      'X-CSRFToken': csrftoken,
      'X-Requested-With': 'XMLHttpRequest',
      Referer: baseUrl
    }
    requestOptions.proxy = proxy
    requestOptions.jar = jar
    requestOptions.json = true
    this.request = request.defaults(requestOptions)
  }
  async login({ username, password } = {}, { _sharedData = true } = {}) {
    username = username || this.credentials.username
    password = password || this.credentials.password

    let value
    try {
      await this.request('/', { resolveWithFullResponse: true }).then(res => {
        const pattern = new RegExp(/(csrf_token":")\w+/)
        const matches = res.toJSON().body.match(pattern)
        value = matches[0].substring(13)
      })
    } catch (e) {
      await this.request('/', { resolveWithFullResponse: true }).then(res => {
        const pattern = new RegExp(/(csrf_token":")\w+/)
        const matches = res.toJSON().body.match(pattern)
        value = matches[0].substring(13)
      })
    }

    this.request = this.request.defaults({
      headers: { 'X-CSRFToken': value }
    })

    const createEncPassword = pwd => {
      return `#PWD_INSTAGRAM_BROWSER:0:${Date.now()}:${pwd}`
    }

    const res = await this.request.post('/accounts/login/ajax/', {
      resolveWithFullResponse: true,
      form: { username, enc_password: createEncPassword(password) }
    })

    if (!res.headers['set-cookie']) {
      throw new Error('No cookie')
    }
    const cookies = res.headers['set-cookie'].map(Cookie.parse)

    const { value: csrftoken } = cookies
      .find(({ key }) => key === 'csrftoken')
      .toJSON()

    this.request = this.request.defaults({
      headers: { 'X-CSRFToken': csrftoken }
    })

    this.credentials = {
      username,
      password,
      cookies: cookies.map(cookie => cookie.toJSON())
    }
    if (_sharedData) {
      try {
        this._sharedData = await this._getSharedData()
      } catch (e) {
        this._sharedData = await this._getSharedData()
      }
    }

    return res.body
  }

  async _getSharedData(url = '/') {
    return this.request(url)
      .then(
        html => html.split('window._sharedData = ')[1].split(';</script>')[0]
      )
      .then(_sharedData => JSON.parse(_sharedData))
  }

  async _getGis(path) {
    const { rhx_gis } = this._sharedData || (await this._getSharedData(path))

    return crypto
      .createHash('md5')
      .update(`${rhx_gis}:${path}`)
      .digest('hex')
  }

  async logout() {
    return this.request('/accounts/logout/ajax/')
  }

  async getProfile() {
    return this.request('/accounts/edit/?__a=1').then(data => data.form_data)
  }

async deleteMedia({ mediaId }) {
  return this.request.post(`/create/${mediaId}/delete/`)
}

  async _uploadVideo({ file }) {
    // Warning! don't change anything bellow.
    const uploadId = Date.now()

    let cvideo = await cVideo(file);

    const ruploadParamsVideo = {
      "client-passthrough":"1",
      "is_igtv_video":true,
      "is_sidecar":"0",
      "is_unified_video":"1",
      "media_type":2,
      "for_album":false,
      "video_format":"",
      "upload_id":uploadId.toString(),
      "upload_media_duration_ms":cvideo.durasi,
      "upload_media_height":cvideo.height,
      "upload_media_width":cvideo.width,
      "video_transform":null
    }

    const nameEntity = `fb_uploader_${uploadId}`

    const headersVideo = {
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Length': cvideo.video.byteLength,
      offset: 0,
      'x-entity-name': nameEntity,
      'x-entity-length': cvideo.video.byteLength,
      'x-ig-app-id': `936619743392459`,
      'x-instagram-ajax': 'ab1282b92e24',
      'x-instagram-rupload-params': JSON.stringify(ruploadParamsVideo)
    }

    await this.request({
      uri: `/rupload_igvideo/${nameEntity}`,
      headers: headersVideo,
      method: 'POST',
      json: false,
      body: cvideo.video
    })

// upload thumbnails
    const ruploadParams = {
      media_type: 2,
      upload_id: uploadId.toString(),
      upload_media_height: cvideo.height,
      upload_media_width: cvideo.width,
    }

    const headersPhoto = {
      'x-entity-type': 'image/jpeg',
      offset: 0,
      'x-entity-name': nameEntity,
      'x-instagram-rupload-params': JSON.stringify(ruploadParams),
      'x-entity-length': cvideo.thumb.byteLength,
      'Content-Length': cvideo.thumb.byteLength,
      'Content-Type': 'image/jpeg',
      'x-ig-app-id': `936619743392459`,
      'Accept-Encoding': 'gzip, deflate, br'
    }

    let responseUpload = await this.request({
      uri: `/rupload_igphoto/${nameEntity}`,
      headers: headersPhoto,
      method: 'POST',
      json: false,
      body: cvideo.thumb
    })

    try {
      responseUpload = JSON.parse(responseUpload)

      if ('upload_id' in responseUpload) return responseUpload

      throw new Error('Image upload error')
    } catch (e) {
      throw new Error(`Image upload error: ${e}`)
    }
  }

  async uploadVideo({ file, caption = '' }) {
    const responseUpload = await this._uploadVideo({ file })
    
    return this.request
      .post(
        `/igtv/configure_to_igtv/`,
        {
          form: {
            source_type: 'library',
            caption: caption,
            upcoming_event: '',
            upload_id: responseUpload.upload_id,
            usertags: '',
            custom_accessibility_caption: '',
            disable_comments: 0,
            like_and_view_counts_disabled: 0,
            igtv_ads_toggled_on: '',
            igtv_share_preview_to_feed: 1,
            is_unified_video: 1,
            video_subtitles_enabled: 0
          }
        }
      )
      .then(response => response)
  }

  async _uploadPhoto({ photo }) {
    // Warning! don't change anything bellow.
    const uploadId = Date.now()

    let {file, width, height} = await cFotoScale(photo);
    const ruploadParams = {
      media_type: 1,
      upload_id: uploadId.toString(),
      upload_media_height: height,
      upload_media_width: width,
      xsharing_user_ids: JSON.stringify([]),
      image_compression: JSON.stringify({
        lib_name: 'moz',
        lib_version: '3.1.m',
        quality: '80'
      })
    }
    

    const nameEntity = `fb_uploader_${uploadId}`

    const headersPhoto = {
      'x-entity-type': 'image/jpeg',
      offset: 0,
      'x-entity-name': nameEntity,
      'x-instagram-rupload-params': JSON.stringify(ruploadParams),
      'x-entity-length': file.byteLength,
      'Content-Length': file.byteLength,
      'Content-Type': 'image/jpeg',
      'x-ig-app-id': `936619743392459`,
      'Accept-Encoding': 'gzip, deflate, br'
    }

    // Json = false, must be important to post work!
    let responseUpload = await this.request({
      uri: `/rupload_igphoto/${nameEntity}`,
      headers: headersPhoto,
      method: 'POST',
      json: false,
      body: file
    })
    try {
      responseUpload = JSON.parse(responseUpload)
      if ('upload_id' in responseUpload) return responseUpload

      // throw new Error('Image upload error')
    } catch (e) {
      throw new Error(`Image upload error: ${e}`)
    }
  }

  async uploadPhoto({ file, caption = '' }) {
    const responseUpload = await this._uploadPhoto({ photo: file })
    // return console.log(responseUpload)
    const dateObj = new Date()
    const now = dateObj
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, ' ')
    const offset = dateObj.getTimezoneOffset()
    return this.request
      .post(
        `/create/configure/`,
        {
          form: {
            upload_id: responseUpload.upload_id,
            caption,
            source_type: '4'
          }
        }
      )
      .then(response => response)
  }

   async getMediaByShortcode({ shortcode }) {
    return this.request(`/p/${shortcode}/?__a=1`).then(
      data => data.items[0]
    )
  }
  
}

module.exports = Instagram