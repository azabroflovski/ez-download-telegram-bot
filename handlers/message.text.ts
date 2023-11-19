import {Composer, InlineKeyboard} from 'grammy'
import { detectUrlPlatform, isUrl } from '../helpers/url'
import { sleep } from '../helpers/promise'
import youtubeDL from '@distube/ytdl-core'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import getInstagramMediaUrl from '@sasmeee/igdl'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import getTiktokMediaUrl from '@sasmeee/tkdl'


const bot = new Composer()

bot.on('message:text', async (ctx) => {

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

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { sd } = (await getTiktokMediaUrl(platform.url.href))[0] as TiktokMediaResponse
        await ctx.replyWithVideo(sd, replyOptions)
    }

    if (platform.name === 'youtube') {
        const { videoDetails, formats: videoFormats } = await youtubeDL.getInfo(platform.url.href)
        const videoThumbnail = videoDetails.thumbnails.at(-1)

        if (videoThumbnail) {
            const inlineButtonsOfFormats = new InlineKeyboard()

            videoFormats
                .filter(format => format.qualityLabel)
                .sort((a, b) => +a.qualityLabel + +b.qualityLabel)
                .forEach((format, index) => {
                const { qualityLabel, mimeType } = format
                if (format.mimeType) {
                    const needMimeType= mimeType?.split(';')[0].split('/')[1]
                    const humanReadableMimeType = needMimeType && needMimeType ? `(${needMimeType})` : ''

                    inlineButtonsOfFormats.text(`${qualityLabel} - ${humanReadableMimeType}`, 'downloadYoutubeVideo')

                    if (index % 2 === 0) {
                        inlineButtonsOfFormats.row()
                    }
                }
            })

            await ctx.replyWithPhoto(videoThumbnail.url, {
                caption: 'Выберите формат:',
                reply_to_message_id: ctx.message.message_id,
                reply_markup: {
                    inline_keyboard: inlineButtonsOfFormats.inline_keyboard
                },
            })
        }
    }

    await ctx.api.deleteMessage(ctx.chat.id, loadingMessage.message_id)
})

export default bot
