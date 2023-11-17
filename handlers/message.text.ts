import { Composer } from 'grammy'
import { detectUrlPlatform, isUrl } from '../helpers/url'
import { sleep } from '../helpers/promise'

const bot = new Composer()

bot.on('message:text', async (ctx, next) => {
    await ctx.replyWithChatAction('typing')

    if (!isUrl(ctx.message.text)) {
        await ctx.reply(`Отправьте ссылку, бот автоматически определит ресурс и загрузит медиа файл, без необходимости подписок и дополнительных шагов.`)
        return
    }

    const platform = detectUrlPlatform(ctx.message.text)

    if (platform.name === 'unknown') {
        await sleep(2000)
        await ctx.reply(`
К сожалению, бот не смог определить медиа файл по указанному URL адресу. 
Убедитесь, что вы отправили корректную ссылку.

/help - для помощи
`, {
            reply_to_message_id: ctx.message.message_id,
        })
        return
    }

    await sleep(1000)
    await ctx.reply('⏳', {
        reply_to_message_id: ctx.message.message_id,
    })

    await ctx.replyWithChatAction('upload_video')
})

export default bot
