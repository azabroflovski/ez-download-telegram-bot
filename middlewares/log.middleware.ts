import { Context, NextFunction } from 'grammy'

export async function logMiddleware(ctx: Context, next: NextFunction): Promise<void> {
    console.log(JSON.stringify(ctx.message))
    await next()
}
