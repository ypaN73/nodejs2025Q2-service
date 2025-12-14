import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import {
  existsSync,
  mkdirSync,
  createWriteStream,
  WriteStream,
  statSync,
} from 'fs';
import { join } from 'path';

@Injectable()
export class LoggingService extends ConsoleLogger {
  private logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];
  private currentLevel: number;
  private logStream: WriteStream;
  private errorStream: WriteStream;
  private maxFileSize: number;

  constructor() {
    super();
    this.currentLevel = this.logLevels.indexOf(
      (process.env.LOG_LEVEL as LogLevel) || 'log',
    );
    this.maxFileSize = parseInt(process.env.MAX_LOG_SIZE) || 10 * 1024 * 1024; // 10MB default

    this.ensureLogDirectory();
    this.createLogStreams();

    // Override console methods
    this.overrideConsoleMethods();
  }

  private ensureLogDirectory() {
    const logDir = join(process.cwd(), 'logs');
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }
  }

  private createLogStreams() {
    const logDir = join(process.cwd(), 'logs');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    this.logStream = createWriteStream(join(logDir, `app-${timestamp}.log`), {
      flags: 'a',
    });
    this.errorStream = createWriteStream(
      join(logDir, `error-${timestamp}.log`),
      { flags: 'a' },
    );
  }

  private overrideConsoleMethods() {
    this.logLevels.forEach((level, index) => {
      if (index <= this.currentLevel) {
        const originalMethod = this[level].bind(this);
        this[level] = (message: any, context?: string, ...args: any[]) => {
          originalMethod(message, context, ...args);
          this.writeToFile(level, message, context);
        };
      } else {
        this[level] = () => {};
      }
    });
  }

  private writeToFile(level: LogLevel, message: any, context?: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level.toUpperCase()} [${context || 'App'}] ${message}\n`;

    const stream = level === 'error' ? this.errorStream : this.logStream;
    stream.write(logMessage);

    // Check file size and rotate if needed
    this.checkAndRotateFiles(stream);
  }

  private checkAndRotateFiles(stream: WriteStream) {
    try {
      const stats = statSync(stream.path as string);
      if (stats.size > this.maxFileSize) {
        stream.end();
        this.createLogStreams();
      }
    } catch (err) {
      // File might not exist yet
    }
  }

  onModuleDestroy() {
    this.logStream.end();
    this.errorStream.end();
  }
}
