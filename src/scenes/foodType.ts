import { CallbackQuery, Update } from '@telegraf/types';
import { Context, Markup, Scenes } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { Network } from '../network/network';
import { Scenes as ScenesName } from './config';
import CallbackQueryUpdate = Update.CallbackQueryUpdate;

interface IFoodType {
  name: string;
  rAndBId: number;
}

export class FoodTypeScene extends Scenes.BaseScene<IBotContext> {
  private foodTypeList: IFoodType[] = [
    { name: 'Размещение без питания', rAndBId: 15350 },
    { name: 'Только завтраки', rAndBId: 2424 },
    { name: 'Завтрак и ужин', rAndBId: 2474 },
    { name: 'Завтрак, обед и ужин', rAndBId: 2749 },
    { name: 'Все включено', rAndBId: 5737 },
    { name: 'Ультра все включено', rAndBId: 5738 },
  ];

  constructor(id: string, public network: Network) {
    super(id);
    this.enter(this.onEnter.bind(this));

    this.foodTypeList.forEach((item) => {
      this.action(item.name, this.onAction.bind(this));
    });
  }

  private async onAction(
    ctx: Context<CallbackQueryUpdate<CallbackQuery>> & Omit<IBotContext, keyof Context<Update>>,
  ): Promise<void> {
    // @ts-ignore
    const type = ctx.update.callback_query.data;

    await ctx.reply(`Тип питания: <b>${type}</b>`, {
      parse_mode: 'HTML',
    });
    const rAndBId = this.foodTypeList.find((item) => item.name === type)?.rAndBId;
    rAndBId && this.network.setRAndBId(rAndBId);
    await ctx.scene.leave();
    //todo доработать
    await this.network.sendRequest()
  }

  private async onEnter(ctx: Context<Update>): Promise<void> {
    const countryNameList = this.foodTypeList.map((item) => {
      return Markup.button.callback(item.name, item.name);
    });

    await ctx.reply('Выбери тип питания', {
      ...Markup.inlineKeyboard(countryNameList, {
        columns: 1,
      }),
    });
  }
}
