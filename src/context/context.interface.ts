import { Scenes } from 'telegraf';

export interface ISessionData {
  testFlag: boolean;
}

export interface MySceneSession extends Scenes.SceneSessionData {
  session: ISessionData;
}

export type IBotContext = Scenes.SceneContext<MySceneSession>;