import { Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { Buttons } from './buttons';
import { Command } from './command.class';

export class StartCommand extends Command {
  constructor(public bot: Telegraf<IBotContext>) {
    super(bot);
  }

  public handle(): void {
    this.bot.start((ctx) =>
      ctx.reply('Привет! Выбери нужное из меню', {
        reply_markup: {
          keyboard: [
            [
              { text: Buttons.SEARCH },
              { text: Buttons.FUN },
              { text: Buttons.CALL },
              { text: Buttons.SETTING },
            ],
          ],
          resize_keyboard: true,
        },
      }),
    );

  }
}
