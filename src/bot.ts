import { Scenes, Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import { Command } from './commands/command.class';
import { SearchCommand } from './commands/search.command';
import { StartCommand } from './commands/start.command';
import { IConfigService } from './config/config.interface';
import { IBotContext } from './context/context.interface';
import { Database } from './database/database';
import { Network } from './network/network';
import { CityFromScene } from './scenes/cityFrom';
import { Scenes as ScenesName } from './scenes/config';
import { CountryToScene } from './scenes/countryTo';
import { CurrencyScene } from './scenes/currency';
import { DateScene } from './scenes/date';
import { FoodTypeScene } from './scenes/foodType';
import { HotelClassesScene } from './scenes/hotelClasses';
import { HotelSelectionScene } from './scenes/hotelSelection';
import { NightsScene } from './scenes/nights';
import { FavoritesCommand } from "./commands/favorites.command";

export class Bot extends Telegraf<IBotContext>{
  public commands: Command[] = [];
  public network: Network;
  public database: Database;

  constructor(configService: IConfigService) {
    super(configService.get('TELEGRAM_API_TOKEN'))
    this.use(new LocalSession({ database: 'sessions.json' }).middleware());
    this.network = new Network();
    this.database = new Database();
  }

  public async init(): Promise<void> {
    this.initScenes();
    this.commands = [new StartCommand(this), new SearchCommand(this),  new FavoritesCommand(this)];
    this.commands.forEach((command) => command.handle());
    await this.launch();
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
      new HotelSelectionScene(ScenesName.HOTEL_SELECTION, this.network, this.database),
    ]);

    // this.bot.use(session());
    this.use(stage.middleware());
  }
}
