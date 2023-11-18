import { createTelegramBot } from './helpers/bot'
import { Context, BotError } from 'grammy'

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

async function onBotRuntimeError(error:  BotError<Context>) {
    console.log(error)
    console.log('runtime error')

    await error.ctx.reply('В работе бота произошла ошибка.')
}

// Start the bot.
bot.start()
    .then(onBotStartSuccess)
    .catch(onBotStartFailed)

// Catch error when bot working
bot.catch(onBotRuntimeError)
