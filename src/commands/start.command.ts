import { Markup, Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { Command } from './command.class';

export class StartCommand extends Command {
  constructor(public bot: Telegraf<IBotContext>) {
    super(bot);
  }

  public handle(): void {
    this.bot.start((ctx) => {
      console.log(ctx.session);
      ctx.reply(
        'set test flag',
        Markup.inlineKeyboard([
          Markup.button.callback('True', 'set_flag_true'),
          Markup.button.callback('False', 'set_flag_false'),
        ]),
      );
    });

    this.bot.action('set_flag_true', (ctx) => {
      ctx.session.testFlag = true;
      ctx.editMessageText('Complete: flag is true');
    });

    this.bot.action('set_flag_false', (ctx) => {
      ctx.session.testFlag = false;
      ctx.editMessageText('Complete: flag is false');
    });
  }
}
