import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import { Command } from './commands/command.class';
import { SearchCommand } from './commands/search.command';
import { StartCommand } from './commands/start.command';
import { IConfigService } from './config/config.interface';
import { IBotContext } from './context/context.interface';

export class Bot {
  public bot: Telegraf<IBotContext>;
  public commands: Command[] = [];

  constructor(private readonly configService: IConfigService) {
    this.bot = new Telegraf<IBotContext>(this.configService.get('TELEGRAM_API_TOKEN'));
    this.bot.use(new LocalSession({ database: 'sessions.json' }).middleware());
  }

  public async init(): Promise<void> {
    this.commands = [new StartCommand(this.bot), new SearchCommand(this.bot)];

    this.commands.forEach((command) => command.handle());
    await this.bot.launch();
  }
}
