import { CallbackQuery, Update } from '@telegraf/types';
import { Context, Markup, Scenes } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { Database } from '../database/database';
import { Network } from '../network/network';
import { ICallbackButton } from './date';
import CallbackQueryUpdate = Update.CallbackQueryUpdate;

enum DataType {
  HOTEL = 'hotel',
}

enum HotelActions {
  NEXT_HOTEL = 'next-hotel',
  PREV_HOTEL = 'prev-hotel',
  SAVE = 'save',
}

export class HotelSelectionScene extends Scenes.BaseScene<IBotContext> {
  private currentId: number = 0;

  constructor(id: string, public network: Network, public database: Database) {
    super(id);
    this.enter(this.onEnter.bind(this));
  }

  private async onAction(
    ctx: Context<CallbackQueryUpdate<CallbackQuery>> & Omit<IBotContext, keyof Context<Update>>,
  ): Promise<void> {}

  private async onEnter(ctx: Context<Update>): Promise<void> {
    this.on('callback_query', (ctx) => {
      // @ts-ignore
      const data = JSON.parse(ctx.update.callback_query.data) as {
        type: DataType;
        date: string;
        action: string | null;
      };

      if (data.type !== DataType.HOTEL) return;

      if (!data.action && data.date) {
        // this.onAction(ctx, data.date);
      } else if (data.action === HotelActions.NEXT_HOTEL) {
        this.nextHotel(ctx);
      } else if (data.action === HotelActions.PREV_HOTEL) {
        this.prevHotel(ctx);
      } else if (data.action === HotelActions.SAVE) {
        this.database.saveHotel(
          `${ctx.update.callback_query.from.id}`,
          JSON.stringify(this.network.hotels[+data.date]),
        );
      }
    });

    await ctx.replyWithPhoto(
      { url: this.network.hotels[0].photo },
      {
        caption: this.network.hotels[0].name,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            ...this.getHotelPageById(0),
            [Markup.button.url(`Посмотреть на сайте`, this.network.hotels[0].link)],
          ],
          resize_keyboard: true,
        },
      },
    );
  }

  private async nextHotel(ctx: Context<Update>) {
    const nextId = this.currentId + 1;

    await ctx.editMessageMedia(
      { type: 'photo', caption: '', media: this.network.hotels[nextId].photo, parse_mode: 'HTML' },
      {
        reply_markup: {
          inline_keyboard: [
            ...this.getHotelPageById(nextId),
            [Markup.button.url(`Посмотреть на сайте`, this.network.hotels[nextId].link)],
          ],
        },
      },
    );
  }

  private async prevHotel(ctx: Context<Update>) {
    const prevId = this.currentId - 1;

    await ctx.editMessageMedia(
      { type: 'photo', caption: '', media: this.network.hotels[prevId].photo, parse_mode: 'HTML' },
      {
        reply_markup: {
          inline_keyboard: [
            ...this.getHotelPageById(prevId),
            [Markup.button.url(`Посмотреть на сайте`, this.network.hotels[prevId].link)],
          ],
        },
      },
    );
  }

  private getHotelPageById(id: number): ICallbackButton[][] {
    this.currentId = id;
    const hotel = this.network.hotels[id];
    const footer: ICallbackButton[] = [];
    footer.push(this.createCallbackButton('<', '', HotelActions.PREV_HOTEL));
    footer.push(
      this.createCallbackButton(`${this.currentId + 1} / ${this.network.hotels.length}`, '', ''),
    );
    footer.push(this.createCallbackButton('>', '', HotelActions.NEXT_HOTEL));

    return [
      [this.createCallbackButton(`Город: ${hotel.city}`, '', '')],
      [this.createCallbackButton(`Дата вылета: ${hotel.date}`, '', '')],
      [this.createCallbackButton(`Цена на 1 чел.: ${hotel.price}`, '', '')],
      [this.createCallbackButton(`Сохранить в закладки`, id.toString(), HotelActions.SAVE)],
      [...footer],
    ];
  }

  protected createCallbackButton(
    name: string,
    value: string,
    // @ts-ignore
    action: string = null,
  ): ICallbackButton {
    return {
      text: name,
      callback_data: JSON.stringify({
        type: DataType.HOTEL,
        date: name.trim() ? value : 0,
        action,
      }),
    };
  }
}
