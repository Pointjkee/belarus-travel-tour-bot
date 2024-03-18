import { CallbackQuery, Message, Update } from '@telegraf/types';
import { Context, Markup, NarrowedContext, Scenes } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { Network } from '../network/network';
import CallbackQueryUpdate = Update.CallbackQueryUpdate;

export interface ICountry {
  name: string;
  countryId: number;
}

// "name": "Минск",
// "cityId": 786
// "name": "Москва",
//   "cityId": 345
export class CountryScene extends Scenes.BaseScene<IBotContext> {
  private countryList: ICountry[] = [
    { name: 'Египет', countryId: 5732 },
    { name: 'Турция', countryId: 1104 },
    { name: 'ОАЭ', countryId: 7067149 },
    { name: 'Грузия', countryId: 1001354 },
    { name: 'Мальдивы', countryId: 166775 },
    { name: 'Кипр', countryId: 7067673 },
    { name: 'Китай', countryId: 140009 },
    { name: 'Шри-Ланка', countryId: 138865 },
    { name: 'Италия', countryId: 154020 },
    { name: 'Испания', countryId: 5733 },
    { name: 'Греция', countryId: 7067498 },
  ];

  constructor(id: string, public network: Network) {
    super(id);
    this.enter(this.onEnter.bind(this));

    this.countryList.forEach((item) => {
      this.action(item.name, this.onAction.bind(this));
    });
  }

  private async onAction(
    ctx: Context<CallbackQueryUpdate<CallbackQuery>> & Omit<IBotContext, keyof Context<Update>>,
  ): Promise<void> {
    // @ts-ignore
    const country = ctx.update.callback_query.data;

    await ctx.reply(`Страна путешействия: <b>${country}</b>`, {
      parse_mode: 'HTML',
    });
    const countryId = this.countryList.find((item) => item.countryId === country)?.countryId;
    countryId && this.network.setCountryId(countryId);
    return ctx.scene.leave();
  }

  private async onEnter(ctx: Context<Update>): Promise<void> {
    const countryNameList = this.countryList.map((item) => {
      return Markup.button.callback(item.name, item.name);
    });

    await ctx.reply('Введи название страны', {
      ...Markup.inlineKeyboard(countryNameList, {
        columns: 2,
      }),
    });
  }

  // this.on('text', this.onChange.bind(this));
  private onChange(
    ctx: NarrowedContext<
      IBotContext,
      {
        message: Update.New & Update.NonChannel & Message.TextMessage;
        update_id: number;
      }
    >,
  ) {
    const regex = /\s+(?=\S)|(?<=\S)\s+/g;
    const formattedText = ctx.update.message.text.replace(regex, '').toLowerCase();
    const firstLetter = formattedText[0].toUpperCase();
    const restOfWord = formattedText.slice(1);
    const country = firstLetter + restOfWord;
    const index = this.countryList.findIndex((el) => el.name === country);
    if (index !== -1) {
      ctx.reply('Есть такая страна');
    } else {
      ctx.reply('Введите правильно страну');
    }
  }
}
