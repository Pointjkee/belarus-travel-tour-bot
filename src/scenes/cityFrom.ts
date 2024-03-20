import { Context, Markup, Scenes } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Network } from "../network/network";
import { CallbackQuery, Update } from "@telegraf/types";
import CallbackQueryUpdate = Update.CallbackQueryUpdate;
import { Scenes as ScenesName } from "./config";

export interface ICity {
  name: string;
  cityId: number;
}
export class CityFromScene extends Scenes.BaseScene<IBotContext> {
  private cityList: ICity[] = [
    { name: 'Минск', cityId: 786 },
    { name: 'Москва', cityId: 345 },
  ];

  constructor(id: string, public network: Network) {
    super(id);
    this.enter(this.onEnter.bind(this));

    this.cityList.forEach((item) => {
      this.action(item.name, this.onAction.bind(this));
    });
  }

  private async onAction(
    ctx: Context<CallbackQueryUpdate<CallbackQuery>> & Omit<IBotContext, keyof Context<Update>>,
  ): Promise<void> {
    // @ts-ignore
    const city = ctx.update.callback_query.data;

    await ctx.reply(`Город отправления: <b>${city}</b>`, {
      parse_mode: 'HTML',
    });
    const cityId = this.cityList.find((item) => item.cityId === city)?.cityId;
    cityId && this.network.setCityId(cityId);
    await ctx.scene.leave();
    await ctx.scene.enter(ScenesName.CURRENCY);
  }

  private async onEnter(ctx: Context<Update>): Promise<void> {
    const cityNameList = this.cityList.map((item) => {
      return Markup.button.callback(item.name, item.name);
    });

    await ctx.reply('Введи город отправления', {
      ...Markup.inlineKeyboard(cityNameList, {
        columns: 2,
      }),
    });
  }
}