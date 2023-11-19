import { TelegramBotBuilder } from '../builders/bot'
import { BotToken } from '../config'

import { logMiddleWare } from '../middlewares'

import {
    startCommand,
    uptimeCommand,
    helpCommand,
} from '../commands'

import { MessageTextHandler } from '../handlers'

/**
 * Create grammy bot instance
 * @link https://deno.land/x/grammy@v1.19.2/mod.ts?s=Bot
 */
export function createTelegramBot() {
    const bot = new TelegramBotBuilder({
        token: BotToken,
    })

    bot.registerMiddleware(logMiddleWare)

    bot.registerCommand('/start', startCommand)
    bot.registerCommand('/uptime', uptimeCommand)
    bot.registerCommand('/help', helpCommand)

    bot.registerModule(MessageTextHandler)

    return bot.build()
}
