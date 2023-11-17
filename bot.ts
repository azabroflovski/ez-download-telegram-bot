import { createTelegramBot } from './helpers/bot'

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

// Start the bot.
bot.start()
    .then(onBotStartSuccess)
    .catch(onBotStartFailed)
