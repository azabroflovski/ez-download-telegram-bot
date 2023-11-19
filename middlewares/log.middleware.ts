import { Context, NextFunction } from 'grammy'
export async function logMiddleWare(ctx: Context, next: NextFunction): Promise<void> {
    console.info(ctx.message)
    await next()
}
