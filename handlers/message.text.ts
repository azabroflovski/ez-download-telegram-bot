import {Composer, InlineKeyboard} from 'grammy'
import { detectUrlPlatform, isUrl } from '../helpers/url'
import { sleep } from '../helpers/promise'
// @ts-ignore
import getInstagramMediaUrl from '@sasmeee/igdl'

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

    const loadingMessage = await ctx.reply('⏳', {
        reply_to_message_id: ctx.message.message_id,
    })

    const replyOptions = {
        reply_to_message_id: ctx.message.message_id,
        caption: 'Скачано с помощью @ez_download_bot',
        reply_markup: {
            inline_keyboard: new InlineKeyboard().url(`Открыть в ${platform.name}`, platform.url.href).inline_keyboard
        }
    }

    await ctx.replyWithChatAction('typing')

    if (platform.name === 'instagram') {

        const { download_link } = (await getInstagramMediaUrl(platform.url.href))[0] as { download_link: string }

        if (download_link.includes('jpg') || download_link.includes('jpeg')) {
            await ctx.replyWithPhoto(download_link, replyOptions)
        } else {
            await ctx.replyWithVideo(download_link, replyOptions)
        }

        await ctx.api.deleteMessage(ctx.chat.id, loadingMessage.message_id)
    }
})

export default bot
