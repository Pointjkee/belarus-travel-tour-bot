import { CallbackQuery, Update } from '@telegraf/types';
import { Context, Markup, Scenes } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { Network } from '../network/network';
import CallbackQueryUpdate = Update.CallbackQueryUpdate;
import { Scenes as ScenesName } from "./config";

enum Currencies {
  USD = 5561,
  EUR = 18864,
}

interface ICurrency {
  name: string;
  currencyId: Currencies;
}

interface IPrice {
  name: string;
  max: number;
}

export class CurrencyScene extends Scenes.BaseScene<IBotContext> {
  private currency = 'USD';
  private currencyList: ICurrency[] = [
    { name: 'USD', currencyId: Currencies.USD },
    { name: 'EUR', currencyId: Currencies.EUR },
  ];
  private maxPriceList: IPrice[] = [
    { name: `2000 ${this.currency}`, max: 2000 },
    { name: `3000 ${this.currency}`, max: 3000 },
    { name: `4000 ${this.currency}`, max: 4000 },
    { name: `5000 ${this.currency}`, max: 5000 },
    { name: `6000 ${this.currency}`, max: 6000 },
    { name: `7000 ${this.currency}`, max: 7000 },
    { name: `8000 ${this.currency}`, max: 8000 },
  ];

  constructor(id: string, public network: Network) {
    super(id);
    this.enter(this.onEnter.bind(this));

    this.currencyList.forEach((item) => {
      this.action(item.name, this.onAction.bind(this));
    });

    this.maxPriceList.forEach((item) => {
      this.action(item.name, this.onActionMaxPrice.bind(this));
    });
  }

  private async onEnter(ctx: Context<Update>): Promise<void> {
    const currencyNameList = this.currencyList.map((item) => {
      return Markup.button.callback(item.name, item.name);
    });

    await ctx.reply('Введи валюту', {
      ...Markup.inlineKeyboard(currencyNameList, {
        columns: 2,
      }),
    });
  }

  private async onAction(
    ctx: Context<CallbackQueryUpdate<CallbackQuery>> & Omit<IBotContext, keyof Context<Update>>,
  ): Promise<void> {
    // @ts-ignore
    const currency = ctx.update.callback_query.data;

    await ctx.reply(`Валюта: <b>${currency}</b>`, {
      parse_mode: 'HTML',
    });
    this.currency = currency;
    const currencyId = this.currencyList.find((item) => item.name === currency)?.currencyId;
    currencyId && this.network.setCurrencyId(currencyId);

    const maxPriceNameList = this.maxPriceList.map((item) => {
      return Markup.button.callback(item.name, item.name);
    });

    await ctx.reply('Выбери максимальную стоимость отдыха', {
      ...Markup.inlineKeyboard(maxPriceNameList, {
        columns: 2,
      }),
    });
  }

  private async onActionMaxPrice(
    ctx: Context<CallbackQueryUpdate<CallbackQuery>> & Omit<IBotContext, keyof Context<Update>>,
  ): Promise<void> {
    // @ts-ignore
    const data = ctx.update.callback_query.data;
    await ctx.reply(`<b>${data}</b>`, {
      parse_mode: 'HTML',
    });
    const maxPrice = this.maxPriceList.find((item) => item.name === data)?.max;
    maxPrice && this.network.setMaxPrice(maxPrice);
    await ctx.scene.leave();
    await ctx.scene.enter(ScenesName.CALENDAR);
  }
}
