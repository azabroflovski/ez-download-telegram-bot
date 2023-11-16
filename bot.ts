import { createTelegramBot } from './helpers/bot'

const bot = createTelegramBot()


// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

function onBotStartSuccess() {
    console.log('bot started')
}

function onBotStartFailed() {
    console.log('bot failed')
}

// Start the bot.
bot.start()
    .then(onBotStartSuccess)
    .catch(onBotStartFailed)
