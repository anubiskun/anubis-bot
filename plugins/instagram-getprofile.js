// coba dulu aja, masi di kembangin, bagi yang ingin ngembangin silahkan

const Instagram = require('../lib/instagram-api')
const FileCookieStore = require('tough-cookie-filestore2')

let handler = async (m) => {
    let wauser = global.db.data.users[m.sender]
    if (wauser.igusername=='') throw 'Login dulu bwang!,\ngimana mau prosses jalan kalo belum login\ncnth: *.instalogin username passwordnya*'
    if (wauser.igpassword=='') throw 'Login dulu bwang!,\ngimana mau prosses jalan kalo belum login\ncnth: *.instalogin username passwordnyas*'
    const cookieStore = new FileCookieStore(`./ig-${m.sender}.json`)
    const client = new Instagram({username: '', password: '', cookieStore: cookieStore })
    let login = await client.login()
    if (login.authenticated==false){
        let a = await client.login({username: wauser.igusername, password: wauser.igpassword})
        if (a.authenticated==false) {
            wauser.igusername = ''
            wauser.igpassword = ''
            wauser.iglogined = false
            m.reply('password udah di ganti sama kamu!\nbot ga bisa posting, coba login lagi!')
        } else {
            try {
                const profile = await client.getProfile()
                let gender
                if (profile.gender==1){
                    gender = 'Laki Laki'
                } else if (profile.gender==2){
                    gender = 'perempuan'
                } else if (profile.gender==3){
                    gender = 'gender ganda/akun bersama'
                }
                let pesan = `*PROFILE*\n
- *Username*: @${profile.username}
- *Full name*: ${profile.full_name}
- *Email*: ${profile.email}
- *Email Confirmed*: ${profile.is_email_confirmed}
- *Phone Number*: ${profile.phone_number}
- *Phone Number Confirmed*: ${profile.is_phone_confirmed}
- *Gender*: ${gender}
- *Custom Gender*: ${profile.custom_gender}
- *Birthday*: ${profile.birthday}
- *Biography*: ${profile.biography}
- *External Url*: ${profile.external_url}
- *Akun Bisnis?*: ${profile.business_account}`
                m.reply(pesan)
            } catch(e){
                m.reply('error tuh!')
            }
        }
    } else {
        try {
        const profile = await client.getProfile()
        let gender
        if (profile.gender==1){
            gender = 'Laki Laki'
        } else if (profile.gender==2){
            gender = 'perempuan'
        } else if (profile.gender==3){
            gender = 'gender ganda/akun bersama'
        }
        let pesan = `*PROFILE*\n
- *Username*: @${profile.username}
- *Full name*: ${profile.full_name}
- *Email*: ${profile.email}
- *Email Confirmed*: ${profile.is_email_confirmed}
- *Phone Number*: ${profile.phone_number}
- *Phone Number Confirmed*: ${profile.is_phone_confirmed}
- *Gender*: ${gender}
- *Custom Gender*: ${profile.custom_gender}
- *Birthday*: ${profile.birthday}
- *Biography*: ${profile.biography}
- *External Url*: ${profile.external_url}
- *Akun Bisnis?*: ${profile.business_account}`
        m.reply(pesan)
        } catch(e){
            m.reply('error tuh!')
        }
    }
    
}
    handler.help = ['instagetprofile']
    handler.tags = ['instabot']
    handler.command = /^(instagetprofile)$/i
    handler.igbot = true
    
    module.exports = handler