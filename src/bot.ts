import { Scenes, Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import { Command } from './commands/command.class';
import { SearchCommand } from './commands/search.command';
import { StartCommand } from './commands/start.command';
import { IConfigService } from './config/config.interface';
import { IBotContext } from './context/context.interface';
import { Scenes as ScenesName } from './scenes/config';
import { CountryScene } from './scenes/country';
import { Network } from "./network/network";

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

  private initScenes() {
    const stage = new Scenes.Stage<IBotContext>([new CountryScene(ScenesName.COUNTRY, this.network)]);

    // this.bot.use(session());
    this.bot.use(stage.middleware());
  }
}
