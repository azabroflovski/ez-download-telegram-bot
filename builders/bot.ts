import { Bot, Context, Middleware } from 'grammy'

export interface TelegramBotBuilderConfig {
    token: string
    developerId?: number | number[]
}

type ContextHandler = (ctx: Context) => void

export class TelegramBotBuilder {
    private config: TelegramBotBuilderConfig
    public bot: Bot
    constructor(config: TelegramBotBuilderConfig) {
        this.config = config
        this.bot = new Bot(this.config.token)
    }

    registerCommand(name: string, handler: ContextHandler) {
        const command = name.includes('/') ? name.slice(1) : name
        this.bot.command(command, handler)
        return this
    }

    registerModule(module: Middleware) {
        this.bot.use(module)
        return this
    }

    build() {
        return this.bot
    }
}

