import { Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { Scenes } from '../scenes/config';
import { Buttons } from './buttons';
import { Command } from './command.class';

export class SearchCommand extends Command {
  constructor(public bot: Telegraf<IBotContext>) {
    super(bot);
  }

  public handle(): void {
    this.bot.hears(Buttons.SEARCH, (ctx) => {
      ctx.scene.enter(Scenes.COUNTRY);
    });
  }
}
