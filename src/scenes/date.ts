import { CallbackQuery, Update } from '@telegraf/types';
import { Context, Scenes } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { Network } from '../network/network';
import CallbackQueryUpdate = Update.CallbackQueryUpdate;
import { Scenes as ScenesName } from "./config";

interface IBaseOptions {
  weekDayNames: string[];
  monthNames: string[];
  averageYears: number;
  callbackDataType?: string;
  ignoreButtonValue: string | number;
  startFromSunday?: boolean;
}

export interface IOptions extends IBaseOptions {
  minDate?: string | number | Date | null;
  maxDate?: string | number | Date | null;
}

interface ICalendarOptions extends IBaseOptions {
  minDate: Date;
  maxDate: Date;
  yearsInLine: number;
}

export interface ICallbackButton {
  text: string;
  callback_data: string;
}

export class DateScene extends Scenes.BaseScene<IBotContext> {
  private options: ICalendarOptions;
  private static WeekLength = 7;
  private currentMonth = 0;
  private currentYear = 0;
  private fromDate: string | null = null;
  private toDate: string | null = null;

  constructor(id: string, public network: Network) {
    super(id);
    this.enter(this.onEnter.bind(this));

    this.on('callback_query', (ctx) => {
      // @ts-ignore
      const data = JSON.parse(ctx.update.callback_query.data) as {
        type: string;
        date: string;
        action: string | null;
      };
      if (!data.action && data.date) {
        this.onAction(ctx, data.date);
      } else if (data.action === 'next-month') {
        this.nextMonth(ctx);
      } else if (data.action === 'prev-month') {
        this.prevMonth(ctx);
      }
    });

    //setting
    const defaultWeekDayNames = [
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
      'Воскресенье',
    ];
    const defaultOptions: ICalendarOptions = {
      weekDayNames: defaultWeekDayNames,
      monthNames: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
      ],
      minDate: this.sanitizeMinMaxDate('01.04.2024'),
      maxDate: this.sanitizeMinMaxDate('19.12.2024'),
      averageYears: 14,
      callbackDataType: 'calendar',
      ignoreButtonValue: 0,
      yearsInLine: 7,
      startFromSunday: false,
    };

    this.options = {
      ...defaultOptions,
    };
  }

  private async onAction(
    ctx: Context<CallbackQueryUpdate<CallbackQuery>> & Omit<IBotContext, keyof Context<Update>>,
    date: string,
  ): Promise<void> {
    if (!this.fromDate) {
      this.fromDate = date.replaceAll('-','.');
      await ctx.reply(`Заезд с ${this.fromDate }`);
    } else {
      this.toDate = date.replace('-','.');
      await ctx.reply(`Заезд с ${this.fromDate} по ${this.toDate}`);
      this.network.setDate(this.fromDate, this.toDate);
      this.fromDate = this.toDate = null;
      await ctx.scene.leave();
      await ctx.scene.enter(ScenesName.CURRENCY);
    }
  }

  private async onEnter(ctx: Context<Update>): Promise<void> {
    await ctx.reply('Выбери дату', {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: this.getPage(new Date()),
      },
    });
  }

  private async nextMonth(ctx: Context<Update>) {
    const currentMonthDate = new Date(this.currentYear, this.currentMonth);
    const newDate = new Date(new Date(currentMonthDate).setMonth(currentMonthDate.getMonth() + 1));
    await ctx.editMessageText('Выбери дату', {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: this.getPage(newDate),
      },
    });
  }

  private async prevMonth(ctx: Context<Update>) {
    const currentMonthDate = new Date(this.currentYear, this.currentMonth);
    const netDate = new Date(new Date(currentMonthDate).setMonth(currentMonthDate.getMonth() + -1));
    await ctx.editMessageText('Выбери дату', {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: this.getPage(netDate),
      },
    });
  }

  private isDate(date: Date): boolean {
    return date instanceof Date && isFinite(date.getTime());
  }

  private sanitizeMinMaxDate(inputDate: string | number | Date): Date {
    const date = new Date(inputDate);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private isValidMinMaxDate(): boolean {
    return (
      !this.options.maxDate || !this.options.minDate || this.options.maxDate >= this.options.minDate
    );
  }

  protected createCallbackButton(
    name: string,
    value: string | number = this.options.ignoreButtonValue,
    // @ts-ignore
    action: string = null,
  ): ICallbackButton {
    return {
      text: name,
      callback_data: JSON.stringify({
        type: this.options.callbackDataType,
        date: name.trim() ? value : this.options.ignoreButtonValue,
        action,
      }),
    };
  }

  private addHeader(date: Date): ICallbackButton[][] {
    const monthYear = `${this.options.monthNames[date.getMonth()]} ${date.getFullYear()}`;
    const header: ICallbackButton[] = [];
    const currentDate = this.formatAnswer(date);
    const result: ICallbackButton[][] = [];

    this.isInMinMonth(date)
      ? header.push(this.createCallbackButton(' '))
      : header.push(this.createCallbackButton('<', currentDate, 'prev-month'));

    header.push(this.createCallbackButton(monthYear, currentDate, 'select-year'));

    this.isInMaxMonth(date)
      ? header.push(this.createCallbackButton(' '))
      : header.push(this.createCallbackButton('>', currentDate, 'next-month'));

    result.push(header);
    result.push(this.options.weekDayNames.map((day) => this.createCallbackButton(day)));
    return result;
  }

  private isDayAvailable(date: Date, month: number): boolean {
    if (this.options.minDate && date < this.options.minDate) return false;
    if (this.options.maxDate && date > this.options.maxDate) return false;

    return date.getMonth() === month;
  }

  private addDays(date: Date): ICallbackButton[][] {
    const sundayOffset = this.options.startFromSunday ? 1 : -5;
    const notSundayOffset = this.options.startFromSunday ? 1 : 2;
    const firstDay = this.getStartOfMonth(date);
    const lastDay = this.getEndOfMonth(date);
    const month = date.getMonth();
    const isSunday = firstDay.getDay() === 0;
    const startDay = -firstDay.getDay() + (isSunday ? sundayOffset : notSundayOffset);
    const startDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), startDay);
    const result: ICallbackButton[][] = [];

    let day = startDate;
    while (day <= lastDay) {
      const days: ICallbackButton[] = [];
      let newDay: Date = new Date();
      for (let i = 0; i < DateScene.WeekLength; i++) {
        newDay = this.addDay(day, i);
        this.isDayAvailable(newDay, month)
          ? days.push(
              this.createCallbackButton(String(newDay.getDate()), this.formatAnswer(newDay)),
            )
          : days.push(this.createCallbackButton(' '));
      }
      day = new Date(this.addDay(newDay));
      result.push(days);
    }

    return result;
  }

  private leadingZero(data: number | string): string {
    return `0${data}`.slice(-2);
  }

  private formatAnswer(date: Date): string {
    const month = this.leadingZero(date.getMonth() + 1);
    const day = this.leadingZero(date.getDate());

    return `${date.getFullYear()}-${month}-${day}`;
  }

  private addDay(date: Date, daysCount = 1): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + daysCount);
  }

  private getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private getEndOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  private isValidDate(date: Date): boolean {
    if (this.options.minDate && date < this.options.minDate) return false;
    if (this.options.maxDate && date > this.options.maxDate) return false;
    return true;
  }

  public getPage(inputDate: number | string | Date): ICallbackButton[][] {
    const date = new Date(inputDate);

    this.currentMonth = date.getMonth();
    this.currentYear = date.getFullYear();
    if (!this.isDate(date)) throw new Error(`Invalid date: ${inputDate}`);

    return [...this.addHeader(date), ...this.addDays(date)];
  }

  public getYears(inputDate: number | string | Date): ICallbackButton[][] {
    const date = new Date(inputDate);

    if (!this.isDate(date) || !this.isValidDate(date))
      throw new Error(`Invalid date: ${inputDate}`);

    const minYear = this.getMinYear(date);
    const maxYear = this.getMaxYear(date);

    let i = minYear;
    const result: ICallbackButton[][] = [];
    while (i <= maxYear) {
      const string: ICallbackButton[] = [];
      for (let j = 0; j < this.options.yearsInLine && i <= maxYear; j++) {
        const newYear = new Date(i, date.getMonth(), date.getDate());
        string.push(this.createCallbackButton(String(i), this.formatAnswer(newYear), 'set-year'));
        i++;
      }
      result.push(string);
    }

    return result;
  }

  private getMaxYear(date: Date): number {
    const year = date.getFullYear() + this.options.averageYears;
    return this.options.maxDate ? Math.min(this.options.maxDate.getFullYear(), year) : year;
  }

  private getMinYear(date: Date): number {
    const year = date.getFullYear() - this.options.averageYears;
    return this.options.minDate ? Math.max(this.options.minDate.getFullYear(), year) : year;
  }

  private isInMinMonth(date: Date): boolean {
    return this.isSameMonth(this.options.minDate, date);
  }

  private isInMaxMonth(date: Date): boolean {
    return this.isSameMonth(this.options.maxDate, date);
  }

  private isSameMonth(optionsDate?: Date, date: Date = new Date()): boolean {
    if (!optionsDate) return false;

    return (
      optionsDate.getFullYear() === date.getFullYear() && optionsDate.getMonth() === date.getMonth()
    );
  }
}