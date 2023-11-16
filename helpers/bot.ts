import { TelegramBotBuilder } from '../builders/bot'
import { BotToken } from '../config'

import {
    startCommand,
    uptimeCommand,
    helpCommand,
} from '../commands'

import { MessageTextHandler } from '../handlers'

export function createTelegramBot() {
    const bot = new TelegramBotBuilder({
        token: BotToken,
    })

    bot.registerCommand('/start', startCommand)
    bot.registerCommand('/uptime', uptimeCommand)
    bot.registerCommand('/help', helpCommand)

    bot.registerModule(MessageTextHandler)

    return bot.build()
}
