const tg = require('telegraf')
const session = require('telegraf/session')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const request = require('request')
const qs = require('./data.json')
const bot = new tg("881789931:AAEdbQajDCGnL7TvdTKNzcmgsSF7YsXCcIE")

bot.use(session())

//   ctx.telegram.sendMessage

let userClass = {}

bot.command("start", (ctx) => {
    console.log(ctx.message.chat.id)

    findUser(ctx.message.chat.id, (user, error) => {
        // ctx.session.scores = { I: 0, E: 0, N: 0, S: 0, F: 0, T: 0, P: 0, J: 0 }
      //  ctx.session.scores = {E: 9, I : 30, N :7, S : 24, F : 7, T : 17, P : 14, J : 23}
      //  ctx.session.q = 0;
        ctx.session.Status = 'N'
        if (error === 0) {
            return ctx.reply("سلام به ربات تست شخصیت شناسی خوش آمدید! ")
        } else {
            return ctx.reply("سلام به ربات آیینه خوش آمدید. \nبا زدن /newTest آزمون را شروع کنید! ")
        }
    })
    //console.log(uuser)
})

bot.command("/newTest", (ctx) => {

    ctx.session.q = 83;
    ctx.session.scores = {E: 9, I : 30, N :7, S : 24, F : 7, T : 17, P : 14, J : 23}
    let i = ctx.session.q;
    let str = qs[i].id + '/87\n';
    str += qs[i].soal;
    str += '\nالف)'
    str += ' ' + qs[i].javab1
    str += '\n\nب)'
    str += ' ' + qs[i].javab2;
    ctx.session.qId = qs[i].id;
    ctx.session.ans = { n1: qs[i].nomre1, n2: qs[i].nomre2 }
    return ctx.reply(str,
        Markup.inlineKeyboard([
            Markup.callbackButton('ب', 'j2'),
            Markup.callbackButton('الف', 'j1')
        ]).extra()

    ).then(resp => {
        ctx.session.q++;
    })

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
                console.log(ctx.session.scores)
            })
        })
    }else
    {
        let chat_id = ctx.update.callback_query.message.id,
            message_id = ctx.update.callback_query.message.message_id;

        ctx.editMessageReplyMarkup(chat_id, message_id, {})
        return ctx.answerCbQuery().then(resp => {
            ctx.session.Status = 'NAME'
            ctx.reply('لطفا نام خود را وارد کنید:')
        })
    }



})

bot.on('text',r=>{
    let status  = r.session.Status;
    if(status=== 'NAME'){
        r.session.Name = r.message.text
        console.log(r.message.text , ' for id: ' , r.message.chat.id , r.message.chat.first_name)
        r.session.Status = 'LASTNAME'
        r.reply('لطفا نام خانوادگی خود را وارد کنید:')
    }else if(status === 'LASTNAME'){
        r.session.lastName = r.message.text
        console.log(r.message.text , ' for id: ' , r.message.chat.id , r.message.chat.first_name)
        r.session.Status = 'EMAIL'
        r.reply('و در آخر ایمیل خود را وارد کنید')
    }
    else if(status === 'EMAIL'){
       let res = flagCalc(r.session.scores)
       r.session.Email = r.message.text
       console.log(r.message.text , ' for id: ' , r.message.chat.id , r.message.chat.first_name)
       r.reply('فلگ شما:   '+ res.flags)
       let drs = 'درصدها: \n'
       drs += res.flags[0] + " : " + res.d[0] + '%\n'
       drs += res.flags[1] + " : " + res.d[1] + '%\n'
       drs += res.flags[2] + " : " + res.d[2] + '%\n'
       drs += res.flags[3] + " : " + res.d[3] + '%\n'
       r.session.Status = 'NAN'
      return r.reply(drs)
       
    // console.log(res.flags[0])
    }
})




bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})



bot.launch()

function flagCalc(scores){

    let darsads = [];
    let l1,l2,l3,l4;

    

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

    let obj = {d : darsads , flags : l1+l2+l3+l4}
    return obj
    
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