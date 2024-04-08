import { Bot } from '../bot';
import { Scenes as ScenesName } from '../scenes/config';
import { Buttons } from './buttons';
import { Command } from './command.class';

export class FavoritesCommand extends Command {
  constructor(public bot: Bot) {
    super(bot);
  }

  public handle(): void {
    this.bot.hears(Buttons.FAVORITES, async (ctx) => {
      await ctx.scene.enter(ScenesName.HOTEL_FAVORITES);
    });
  }
}
