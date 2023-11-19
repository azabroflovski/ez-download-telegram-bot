import { createTelegramBot } from './helpers/bot'
import { Context, BotError, GrammyError, HttpError } from 'grammy'
import './shared/sentry'
import * as Sentry from '@sentry/node'
import {run} from "@grammyjs/runner";

const bot = createTelegramBot()

async function onBotRuntimeError({ error, ctx }:  BotError<Context>) {
    if (error instanceof GrammyError) {
        console.error("Error in request:", error.description);
    } else if (error instanceof HttpError) {
        console.error("Could not contact Telegram:", error);
    } else {
        console.error("Unknown error:", error);
    }

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

// Catch error when bot working
bot.catch(onBotRuntimeError)

const botRunner = run(bot)

// Stopping the bot when the Node.js process
// is about to be terminated
const stopRunner = () => botRunner.isRunning() && botRunner.stop();
process.once("SIGINT", stopRunner);
process.once("SIGTERM", stopRunner);
