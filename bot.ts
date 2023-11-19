import { createTelegramBot } from './helpers/bot'
import { Context, BotError } from 'grammy'
import './shared/sentry'
import * as Sentry from '@sentry/node'

const bot = createTelegramBot()

/**
 * Bot running up successfully
 */
function onBotStartSuccess() {
    console.log('bot started')
}

/**
 * Calls when bot running up failed
 */
function onBotStartFailed() {
    console.log('bot failed')
}

async function onBotRuntimeError({ error, ctx }:  BotError<Context>) {
    if (ctx.from) {
        Sentry.setUser({
            id: ctx.from.id,
            username: ctx.from.username,
        })
        Sentry.setContext('from', ctx.from)
        Sentry.setTags({
            chat_id: ctx.from.id,
            username: ctx.from.username,
        })
    }

    if (ctx.chat) {
        Sentry.setContext('chat', ctx.chat)
    }

    if (ctx.message) {
        Sentry.setContext('message', ctx.message)
    }

    Sentry.captureException(error)

    await ctx.reply('В работе бота произошла ошибка.')
}

// Start the bot.
bot.start()
    .then()
    .catch(onBotStartFailed)

// Catch error when bot working
bot.catch(onBotRuntimeError)
