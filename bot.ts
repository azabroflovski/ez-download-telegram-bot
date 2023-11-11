import { Bot } from 'grammy'

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot('6907288230:AAGewZLSnXPCwae0ZULVb5yrex2P9pMVFA8') // <-- put your bot token between the ""
const startTime = new Date()
// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
bot.command('start', (ctx) => ctx.reply("Welcome! Up and running."))

// Handle the /uptime command.
bot.command('uptime', async (ctx) => {
    await ctx.reply(`
uptime: ${new Date(process.uptime())}
upsince: ${startTime}
localtime: ${new Date()}
    `)
})

bot.on('message', (ctx) => {
    ctx.reply('great message')
})

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
