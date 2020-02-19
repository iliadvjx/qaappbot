const tg = require('telegraf')
const session = require('telegraf/session')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const validator = require('validator')
const request = require('request')
const qs = require('./data.json')
const bot = new tg("902595979:AAEPohupjhoXqI16V_62ysIHkkqrcrns0No")
const fs = require('fs')
bot.use(session())

// saveID('1')
bot.command("start", (ctx) => {
    console.log('START : Name:', ctx.message.chat.first_name, '|| Username:', ctx.message.chat.username, '|| ID:', ctx.message.chat.id)
    saveID(ctx.message.chat.id);
    getRole(ctx)
    // findUser(ctx.message.chat.id, (user, error) => {
    console.log(ctx.session.role)
 
    ctx.session.Status = 'TEST'
    bot.telegram.sendMessage('147721692', `START : Name:  ${ctx.message.chat.first_name} || Username: ${ctx.message.chat.username} || ID:  ${ctx.message.chat.id}`,
        {
            disable_notification: true
        })
    //    console.log(x)
    ctx.reply("سلام به ربات تست شخصیت شناسی خوش آمدید! ", Markup
        .keyboard([
            ['شروع تست']
            , ['راهنما', 'تاریخچه اجرای تست']
        ])
        .oneTime()
        .resize()
        .extra()
    )

    setTimeout(()=>{
        ctx.reply(`❗️ تست mbti به شما کمک میکنه که درک بهتری از شخصیت خودتون و اطرافیانتون پیدا کنید و تو زمینه هایی مثل:

        ✅  ۱) خودشناسی و شناخت بهتر جنبه های مختلف شخصیت خودتون
  
        ✅  ۲) ارتباط بهتر با نزدیکان و دوستانتون با شناخت شخصیت اونها
  
        ✅  ۳) انتخاب شغل مناسب خودتون یا بهبود عملکردتون تو شغل فعلیتون
  
        ✅  ۴) انتخاب همسر مناسبتون یا ارتباط بهتر با همسرتون
  
        ✅  ۵) پدر و مادری بهتر و تاثیر گذار تر شدن برای فرزند عزیتون
  
        ✅  ۶) مشاوره ی بهتر به مراجعینتون  با در نظر گرفتن ابعاد شخصیت فرد
  
        ✅  ۷) بازدهی بیشتر در گروهی که در اون کار میکنید یا مدیری بهتر و کارآمد تر شدن با شناخت بهتر کارمندهاتون
  
        ⚜️  و در کلی زمینه های دیگه کمکتون میکنه و به شما حس کارآمدی بیشتری میده
  
        ‼️  توجه : پیشنهاد میکنیم برای نتیجه ی بهتر و درست تر حتما راهنمای تست رو قبل انجام اون مطالعه کنید`)
    }, 1050)
     


    //console.log(uuser)
})

bot.hears(["شروع تست", 'شروع مجدد'], (ctx) => {
    // if(ctx.session.Status == 'TEST'){
    //     return ctx.reply('شما درحال انجام آزمون هستید آیا مطمئنید میخواهید دوباره شروع کنید؟')
    // }

    ctx.session.q = 0;
    ctx.session.scores = { I: 0, E: 0, N: 0, S: 0, F: 0, T: 0, P: 0, J: 0 }
    // ctx.session.scores = { E: 9, I: 30, N: 7, S: 24, F: 7, T: 17, P: 14, J: 23 }
    let i = ctx.session.q;
    let str = qs[i].id + '/87\n';
    str += qs[i].soal;
    str += '\nالف)'
    str += ' ' + qs[i].javab1
    str += '\n\nب)'
    str += ' ' + qs[i].javab2;
    ctx.session.qId = qs[i].id;
    ctx.session.ans = { n1: qs[i].nomre1, n2: qs[i].nomre2 }
    ctx.reply('آزمون شما شروع شد. برای شروع دوباره میتوانید شروع مجدد را بفرستید.', Markup
        .keyboard([
            ['شروع مجدد']

        ])
        .oneTime()
        .resize()
        .extra()
    )

    // ctx.Telegram.sendMessage('147721692','یکی آمد!').then(what=> console.log(what))
    return ctx.reply(str,
        Markup.inlineKeyboard([
            Markup.callbackButton('ب', 'j2'),
            Markup.callbackButton('الف', 'j1')
        ]).extra()

    ).then(resp => {
        ctx.session.q++;
    })

})
bot.hears('بازگشت' , ctx =>{
    ctx.reply("برگشتید به منو ", Markup
        .keyboard([
            ['شروع تست']
            , ['راهنما', 'تاریخچه اجرای تست']
        ])
        .oneTime()
        .resize()
        .extra()
    )
})
bot.on('callback_query', (ctx) => {
    let x = ctx.update.callback_query.data;
    let d;
    let index = ctx.session.qId;

    if (x == 'j1') {
        d = `شما برای سوال ${ctx.session.qId} الف را انتخاب کردید`;
        if (index <= 25) ctx.session.scores.E += ctx.session.ans.n1
        else if (index > 25 && index <= 44) ctx.session.scores.S += ctx.session.ans.n1
        else if (index > 44 && index <= 68) ctx.session.scores.T += ctx.session.ans.n1
        else if (index > 68 && index <= 87) ctx.session.scores.J += ctx.session.ans.n1
    }

    else {
        d = `شما برای سوال ${ctx.session.qId} ب را انتخاب کردید`;
        if (index <= 25) ctx.session.scores.I += ctx.session.ans.n1
        else if (index > 25 && index <= 44) ctx.session.scores.N += ctx.session.ans.n1
        else if (index > 44 && index <= 68) ctx.session.scores.F += ctx.session.ans.n1
        else if (index > 68 && index <= 87) ctx.session.scores.P += ctx.session.ans.n1
    }


    let i = ctx.session.q;
    if (i != 87) {
        let str = qs[i].id + '/87\n';
        str += qs[i].soal;
        str += '\nالف)'
        str += ' ' + qs[i].javab1
        str += '\n\nب)'
        str += ' ' + qs[i].javab2;
        ctx.session.qId = qs[i].id;
        ctx.session.ans = { n1: qs[i].nomre1, n2: qs[i].nomre2 }
        // console.log(qs[i])


        // console.log(ctx.update.callback_query)
        let chat_id = ctx.update.callback_query.message.id,
            message_id = ctx.update.callback_query.message.message_id;

        ctx.editMessageReplyMarkup(chat_id, message_id, {})


        // ctx.session.q += 1;
        // console.log( ctx.session.q)


        return ctx.answerCbQuery(d).then(resp => {
            // console.log(resp)

            ctx.reply(str,
                Markup.inlineKeyboard([
                    Markup.callbackButton('ب', 'j2'),
                    Markup.callbackButton('الف', 'j1')
                ]).extra()

            ).then(resp => {
                ctx.session.q += 1;
                // console.log(ctx.session.q)
                // console.log(ctx.session.scores)
            })
        })
    } else {
        let chat_id = ctx.update.callback_query.message.id,
            message_id = ctx.update.callback_query.message.message_id;

        ctx.editMessageReplyMarkup(chat_id, message_id, {})
        return ctx.answerCbQuery().then(resp => {
            ctx.session.Status = 'NAME'
            ctx.reply('لطفا نام خود را وارد کنید:')
        })
    }



})

bot.hears('راهنما', ctx => {
   return ctx.replyWithPhoto('https://dl.hasanabaadi.com/pics/help.png',
   Extra.caption('@Ayene1bot'))
})

bot.hears('تاریخچه اجرای تست', ctx => {
    findUser(ctx.message.chat.id , (body,st)=>{
        if(st == 1){
            let str =  'نتایج تست های قبلی شما:\n';
            body.flags.forEach((item)=>{
               str += item.flag + '\n'
            })
            ctx.reply(str)
        }
    })
 })

 bot.on('text', r => {
    let status = r.session.Status;
    if (status === 'NAME') {
        r.session.Name = r.message.text
        console.log(r.message.text, ' for id: ', r.message.chat.id, r.message.chat.first_name)
        r.session.Status = 'LASTNAME'
        r.reply('لطفا نام خانوادگی خود را وارد کنید:')
    } else if (status === 'LASTNAME') {
        r.session.lastName = r.message.text
        console.log(r.message.text, ' for id: ', r.message.chat.id, r.message.chat.first_name)
        r.session.Status = 'EMAIL'
        r.reply('و در آخر ایمیل خود را وارد کنید')
    }
    else if (status === 'EMAIL') {

        if (!validator.isEmail(r.message.text))
            return r.reply('لطفا ایمیل معتبر وارد کنید: ')

        let res = flagCalc(r.session.scores)
        r.session.Email = r.message.text
        let svBODY = {}
        svBODY.tgUN = r.message.chat.username
        svBODY.tgid = r.message.chat.id
        svBODY.name = r.session.Name
        svBODY.lastname = r.session.lastName
        svBODY.email = r.session.Email

        fireReq(svBODY, res.flags, err => { console.log(err) })

        console.log(r.message.text, ' for id: ', r.message.chat.id, r.message.chat.first_name)
        // r.reply()
        let drs = 'نتیجه تست شخصیت شناسی شما: ' + res.flags + '\n\n'
         drs += 'درصدها: \n'
        drs += res.flags[0] + " : " + res.d[0] + '%\n'
        drs += res.flags[1] + " : " + res.d[1] + '%\n'
        drs += res.flags[2] + " : " + res.d[2] + '%\n'
        drs += res.flags[3] + " : " + res.d[3] + '%\n'
        drs+='\n@Ayene1bot'
        r.session.Status = 'NAN'
        r.reply(drs,Markup
            .keyboard([
                ['بازگشت']
               
            ])
            .oneTime()
            .resize()
            .extra()
            
            )
        setTimeout(()=>{
            r.replyWithPhoto('https://dl.hasanabaadi.com/pics/' + res.flags + '.png',
            Extra.caption('اطلاعاتی درباره شخصیت شما به مختصر\nموارد بیشتر در:\nhttps://hasanabaadi.com\n\n@Ayene1bot'))
            .then(err => {
                // console.log(err, 'send or not?')
            }).catch(err => {
                console.log(err)
            })
        },1050)

        setTimeout(()=>{
            r.reply(
`🔷این عکس فقط یک نمای کلی از شخصیت شماست،
هنوز کلی حرف داریم برات😉!!
🔶از اینکه برای خودت وقت گذاشتی و تست رو انجام دادی بهت تبریک میگم دوست من
🔷اما برای اینکه خیلی بهتر و بیشتر با نتایج جالب این تست آشنا بشی و اطلاعات فوق العاده جالب تری راجب تست mbti و شخصیتت بدست بیاری همین حالا روی لینک زیر کلیک کن و آموزش کاملا رایگان مارو دانلود کن👇:
<a href="https://www.hasanabaadi.com/">دانلود!</a>
`
,{parse_mode:'HTML'}
)
        },1500)
       
        return 

        // console.log(res.flags[0])
    }
})
bot.command('/admin',ctx => {
    // console.log('heyyyyyy', 1)
    // console.log(ctx.session.role)
    if (ctx.session.role == 'admin') {
        ctx.reply('سلام ادمین یکی از اپشن هارو انتخاب کن',
            Markup
                .keyboard([
                    ['آمار کلی']
                    , ['ارسال پیام به همه']
                    , ['بازگشت']
                ])
                .oneTime()
                .resize()
                .extra()
        )
    }
})

bot.hears(['آمار کلی'], ctx => {
    // console.log('is ok')
    if (ctx.session.role == 'admin') {
        request({
            url:'http://qaapp-sv.herokuapp.com/info',
            method: 'GET',
            json:true
        },function (error, response, body) {
            // console.log(body)
            console.log(body.ESTP / body.test_Count)
            let str = 
`
تعداد کاربران: ${body.user_Count},
تعداد تست های انجام شده: ${body.test_Count},
ESTP:  ${Math.floor(body.ESTP / body.test_Count * 100) }% ,
ESFJ:  ${Math.floor(body.ESFJ / body.test_Count * 100) }% ,
ESTJ:  ${Math.floor(body.ESTJ / body.test_Count * 100) }% ,
ESFP:  ${Math.floor(body.ESFP / body.test_Count * 100) }% ,
ENFP:  ${Math.floor(body.ENFP / body.test_Count * 100) }% ,
ENTP:  ${Math.floor(body.ENTP / body.test_Count * 100) }% ,
ENTJ:  ${Math.floor(body.ENTJ / body.test_Count * 100) }% ,
ENJF:  ${Math.floor(body.ENJF / body.test_Count * 100) }% ,
ISTJ:  ${Math.floor(body.ISTJ / body.test_Count * 100) }% ,
ISTP:  ${Math.floor(body.ISTP / body.test_Count * 100) }% ,
ISFP:  ${Math.floor(body.ISFP / body.test_Count * 100) }% ,
ISFJ:  ${Math.floor(body.ISFJ / body.test_Count * 100) }% ,
INFP:  ${Math.floor(body.INFP / body.test_Count * 100) }% ,
INFJ:  ${Math.floor(body.INFJ / body.test_Count * 100) }% ,
INTJ:  ${Math.floor(body.INTJ / body.test_Count * 100) }% ,
INTP:  ${Math.floor(body.INTP / body.test_Count * 100) }% ,
`
            ctx.reply(str)
        })
    }
})
bot.hears('ارسال پیام به همه', ctx => {
    if (ctx.session.role == 'admin') {
        ctx.session.Status = 'admin_msg'
        ctx.reply('پیام خود را بفرستید. توجه داشته باشین که برای فرستادن عکس کپشن لازم است در غیر این صورت ربات ارسال نخواهد کرد.')
        
    }
})

bot.on('message', ctx => {
    if (ctx.session.Status == 'admin_msg') {
        // console.log(ctx.message)
        let file = fs.readFileSync('ids.txt').toString().split(",")
        
        file.forEach(id =>{
            bot.telegram.sendCopy(id,ctx.message).then(t=>{
                // ctx.reply('پیام با موفقیت ارسال شد')
                ctx.session.Status = 'NaN'
            })
        })
        
    }
})






bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})



bot.launch()

function flagCalc(scores) {

    let darsads = [];
    let l1, l2, l3, l4;



    if (scores.E > scores.I) {
        l1 = 'E';
        darsads.push(Math.round((scores.E / 32) * 100))
        //  console.log(Math.round((scores.E / 32) * 100), 'E')
    } else {
        l1 = 'I'
        darsads.push(Math.round((scores.I / 37) * 100))
        //  console.log(Math.round((scores.I / 37) * 100), 'I')
    }

    if (scores.S > scores.N) {
        l2 = 'S'
        darsads.push(Math.round((scores.S / 27) * 100))
        //   console.log(Math.round((scores.S / 27) * 100), 'S')
    } else {
        l2 = 'N'
        darsads.push(Math.round((scores.N / 28) * 100))
        // console.log(Math.round((scores.N / 28) * 100), 'N')
    }

    if (scores.T > scores.F) {
        l3 = 'T'
        darsads.push(Math.round((scores.T / 24) * 100))
        // console.log(Math.round((scores.T / 24) * 100), 'T')
    } else {
        l3 = 'F'
        darsads.push(Math.round((scores.F / 28) * 100))
        //  console.log(Math.round((scores.F / 28) * 100), 'F')
    }

    if (scores.J > scores.P) {
        l4 = 'J'
        darsads.push(Math.round((scores.J / 28) * 100))
        //   console.log(Math.round((scores.J / 28) * 100), 'J')
    } else {
        l4 = 'P'
        darsads.push(Math.round((scores.P / 31) * 100))
        //console.log(Math.round((scores.P / 31) * 100), 'P')
    }
    //  console.log(darsads , 'darsads')

    let obj = { d: darsads, flags: l1 + l2 + l3 + l4 }
    return obj

}

function fireReq(info, flags, cb) {
    // console.log(info)
    request({
        url: 'http://qaapp-sv.herokuapp.com/email',
        method: 'POST',
        body: { name: info.name, lastname: info.lastname, email: info.email, flag: flags, tgID: info.tgid, tgUsername: info.tgUN },
        json: true,
        headers: { "accept": "application/json", "content-type": "application/json" }
    }, function (error, response, body) {
        if (!error) {
            //    console.log(body)
            cb(1)
        }
        else {
            //alert('خطا در هنگام ثبت ایمیل، لطفا اتصال اینترنت خود را بررسی کنید یا از طریق فرم تماس مشکل را گزارش دهید.')
            cb(0)
        }

    })

}

function findUser(id, cb) {
    request({
        url: "https://qaapp-sv.herokuapp.com/tgRegistred",
        json: true,
        body: { tgid: id }
    }, (err, res, body) => {
        if (!body.ERROR) {
            cb(body, 1)
        } else
            cb(undefined, 0)
    })
}



const getRole = c => {
    console.log(c.message.chat.id)
    if (c.message.chat.id == '147721692')
        c.session.role = 'admin'
    else
        c.session.role = 'user'
}

function saveID(id) {
    let file = fs.readFileSync('./ids.txt');
    let arr = file.toString().split(",")
    // console.log(arr , ' -- ' , arr.indexOf(id.toString()))
    if (arr.indexOf(String(id)) === -1) {
        arr.push(id)
        fs.writeFileSync('ids.txt', arr)
    }
    // console.log(arr)
}