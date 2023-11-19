import { Bot, Context, Middleware } from 'grammy'

export interface TelegramBotBuilderConfig {
    token: string
    developerId?: number | number[]
}

type ContextHandler = (ctx: Context) => void

export class TelegramBotBuilder {
    /**
     * Telegram bot configuration
     * @private
     */
    private config: TelegramBotBuilderConfig

    /**
     * Grammy bot instance
     * @public
     * @link https://deno.land/x/grammy@v1.19.2/mod.ts?s=Bot
     */
    public bot: Bot

    constructor(config: TelegramBotBuilderConfig) {
        this.config = config
        this.bot = new Bot(this.config.token)
    }

    /**
     * Register bot command
     * @link https://grammy.dev/guide/commands#commands
     * @param name
     * @param handler
     */
    registerCommand(name: string, handler: ContextHandler) {
        const command = name.includes('/') ? name.slice(1) : name
        this.bot.command(command, handler)
        return this
    }

    /**
     * Register bot module (middleware)
     * @link https://grammy.dev/guide/middleware#middleware
     * @param middleware
     */
    registerMiddleware(middleware: Middleware) {
        this.bot.use(middleware)
        return this
    }

    /**
     * Register bot module (middleware)
     * @link https://grammy.dev/guide/middleware#middleware
     * @param module
     */
    registerModule(module: Middleware) {
        this.bot.use(module)
        return this
    }

    build() {
        return this.bot
    }
}

