import { Context } from 'telegraf';

export interface ISessionData {
    testFlag: boolean;
}

export interface IBotContext extends Context {
  session: ISessionData;
}
