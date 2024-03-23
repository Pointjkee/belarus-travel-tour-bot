import { Scenes, Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import { Command } from './commands/command.class';
import { SearchCommand } from './commands/search.command';
import { StartCommand } from './commands/start.command';
import { IConfigService } from './config/config.interface';
import { IBotContext } from './context/context.interface';
import { Network } from './network/network';
import { CityFromScene } from './scenes/cityFrom';
import { Scenes as ScenesName } from './scenes/config';
import { CountryToScene } from './scenes/countryTo';
import { CurrencyScene } from "./scenes/currency";
import { DateScene } from "./scenes/date";
import { NightsScene } from "./scenes/nights";
import { HotelClassesScene } from "./scenes/hotelClasses";
import { FoodTypeScene } from "./scenes/foodType";

export class Bot {
  public bot: Telegraf<IBotContext>;
  public commands: Command[] = [];
  private network: Network;

  constructor(private readonly configService: IConfigService) {
    this.bot = new Telegraf<IBotContext>(this.configService.get('TELEGRAM_API_TOKEN'));
    this.bot.use(new LocalSession({ database: 'sessions.json' }).middleware());
    this.network = new Network();
  }

  public async init(): Promise<void> {
    this.initScenes();
    this.commands = [new StartCommand(this.bot), new SearchCommand(this.bot)];
    this.commands.forEach((command) => command.handle());
    await this.bot.launch();
  }

  private initScenes(): void {
    const stage = new Scenes.Stage<IBotContext>([
      new CountryToScene(ScenesName.COUNTRY, this.network),
      new CityFromScene(ScenesName.CITY, this.network),
      new CurrencyScene(ScenesName.CURRENCY, this.network),
      new DateScene(ScenesName.CALENDAR, this.network),
      new NightsScene(ScenesName.NIGHTS, this.network),
      new HotelClassesScene(ScenesName.HOTEL, this.network),
      new FoodTypeScene(ScenesName.FOOD, this.network),
    ]);

    // this.bot.use(session());
    this.bot.use(stage.middleware());
  }
}
