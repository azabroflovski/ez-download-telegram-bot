import { Context } from 'grammy'

const startTime = new Date()

export async function uptimeCommand(ctx: Context) {
    await ctx.reply(`
uptime: ${new Date(process.uptime())}
upsince: ${startTime}
localtime: ${new Date()}
    `)
}
