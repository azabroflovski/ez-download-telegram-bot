import {Composer, InlineKeyboard} from 'grammy'
import { detectUrlPlatform, isUrl } from '../helpers/url'
import { sleep } from '../helpers/promise'
// @ts-ignore
import getInstagramMediaUrl from '@sasmeee/igdl'
// @ts-ignore
import getTiktokMediaUrl from '@sasmeee/tkdl'

const bot = new Composer()

bot.on('message:text', async (ctx, next) => {

    if (!isUrl(ctx.message.text)) {
        await ctx.replyWithChatAction('typing')
        await sleep(1000)
        await ctx.reply(`Отправьте ссылку, бот автоматически определит ресурс и загрузит медиа файл, без необходимости подписок и дополнительных шагов.`)
        return
    }

    const platform = detectUrlPlatform(ctx.message.text)

    if (platform.name === 'unknown') {
        await ctx.replyWithChatAction('typing')
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



    await ctx.replyWithChatAction('typing')
    const replyOptions = {
        reply_to_message_id: ctx.message.message_id,
        caption: 'Скачано с помощью @ez_download_bot',
        reply_markup: {
            inline_keyboard: new InlineKeyboard().url(`Открыть в ${platform.name}`, platform.url.href).inline_keyboard
        }
    }

    await sleep(500)
    const loadingMessage = await ctx.reply('⏳', {
        reply_to_message_id: ctx.message.message_id,
    })

    if (platform.name === 'instagram') {
        interface InstagramMediaResponse {
            thumbnail_link: string
            download_link: string
        }

        const { download_link } = (await getInstagramMediaUrl(platform.url.href))[0] as InstagramMediaResponse

        if (download_link.includes('jpg') || download_link.includes('jpeg')) {
            await ctx.replyWithChatAction('upload_photo')
            await sleep(500)
            await ctx.replyWithPhoto(download_link, replyOptions)
        } else {
            await ctx.replyWithChatAction('upload_video')
            await sleep(500)
            await ctx.replyWithVideo(download_link, replyOptions)
        }

        return
    }


    if (platform.name === 'tiktok') {
        interface TiktokMediaResponse {
            title: string
            author: string
            sd: string
            hd: string
            audio: string
            thumbnail: string
        }

        await ctx.replyWithChatAction('upload_video')
        await sleep(1000)

        const { sd } = (await getTiktokMediaUrl(platform.url.href))[0] as TiktokMediaResponse
        await ctx.replyWithVideo(sd, replyOptions)
    }

    await ctx.api.deleteMessage(ctx.chat.id, loadingMessage.message_id)
})

export default bot
