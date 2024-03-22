import { CallbackQuery, Update } from '@telegraf/types';
import { Context, Markup, Scenes } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { Network } from '../network/network';
import { Scenes as ScenesName } from './config';
import CallbackQueryUpdate = Update.CallbackQueryUpdate;

export class NightsScene extends Scenes.BaseScene<IBotContext> {
  private nights: string[] = ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];

  constructor(id: string, public network: Network) {
    super(id);
    this.enter(this.onEnter.bind(this));

    this.nights.forEach((item) => {
      this.action(item, this.onAction.bind(this));
    });
  }

  private async onAction(
    ctx: Context<CallbackQueryUpdate<CallbackQuery>> & Omit<IBotContext, keyof Context<Update>>,
  ): Promise<void> {
    // @ts-ignore
    const nights = ctx.update.callback_query.data;

    if (!nights) return;

    if (!this.network.nightsMin) {
      await ctx.reply(`Минимальное кол-во ночей: <b>${nights}</b>`, {
        parse_mode: 'HTML',
      });

      this.network.setMinNights(nights);

      const cityNameList = this.nights.map((item) => {
        return Markup.button.callback(item, item);
      });

      await ctx.reply('Максимальное количество ночей, проведенных в отеле', {
        ...Markup.inlineKeyboard(cityNameList, {
          columns: 5,
        }),
      });
    } else if (!this.network.nightsMax) {
      await ctx.reply(`Максимальное кол-во ночей: <b>${nights}</b>`, {
        parse_mode: 'HTML',
      });
      this.network.setMaxNights(nights);
      await ctx.scene.leave();
      await ctx.scene.enter(ScenesName.NIGHTS);
    }
  }

  private async onEnter(ctx: Context<Update>): Promise<void> {
    const cityNameList = this.nights.map((item) => {
      return Markup.button.callback(item, item);
    });

    await ctx.reply('Минимальное количество ночей, проведенных в отеле', {
      ...Markup.inlineKeyboard(cityNameList, {
        columns: 5,
      }),
    });
  }
}
