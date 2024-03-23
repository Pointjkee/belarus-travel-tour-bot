import { Context, Markup, Scenes } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Network } from "../network/network";
import { CallbackQuery, Update } from "@telegraf/types";
import { Scenes as ScenesName } from "./config";
import CallbackQueryUpdate = Update.CallbackQueryUpdate;

export interface IHotelClass {
  name: string;
  classId: number;
}

export class HotelClassesScene extends Scenes.BaseScene<IBotContext> {
  private hotelClasses: IHotelClass[] = [
    // { class: '⭐', classId: 2566 },
    // { class: '⭐⭐', classId: 2567 },
    { name: '⭐⭐⭐', classId: 2568 },
    { name: '⭐⭐⭐⭐', classId: 2569 },
    { name: '⭐⭐⭐⭐⭐', classId: 2570 },
  ];

  constructor(id: string, public network: Network) {
    super(id);
    this.enter(this.onEnter.bind(this));

    this.hotelClasses.forEach((item) => {
      this.action(item.name, this.onAction.bind(this));
    });
  }

  private async onAction(
    ctx: Context<CallbackQueryUpdate<CallbackQuery>> & Omit<IBotContext, keyof Context<Update>>,
  ): Promise<void> {
    // @ts-ignore
    const name = ctx.update.callback_query.data;

    await ctx.reply(`Уровень отеля: <b>${name}</b>`, {
      parse_mode: 'HTML',
    });
    const classId = this.hotelClasses.find((item) => item.name === name)?.classId;
    classId && this.network.setHotelClassId(classId);
    await ctx.scene.leave();
    await ctx.scene.enter(ScenesName.FOOD);
  }

  private async onEnter(ctx: Context<Update>): Promise<void> {
   const countryNameList = this.hotelClasses.map((item) => {
      return Markup.button.callback(item.name, item.name);
    });

    await ctx.reply('Выбери уровень отеля', {
      ...Markup.inlineKeyboard(countryNameList, {
        columns: 3,
      }),
    });
  }
}