import { Injectable, LoggerService, Logger } from '@nestjs/common';

@Injectable()
export class AppLogger implements LoggerService {
  private readonly logger = new Logger('AppLogger');

  // log for general info
  log(message: string, context?: string) {
    this.logger.log(message, context || 'App');
  }

  // log for errors
  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context || 'App');
  }

  // log for warnings
  warn(message: string, context?: string) {
    this.logger.warn(message, context || 'App');
  }

  // debug logs
  debug(message: string, context?: string) {
    this.logger.debug(message, context || 'App');
  }

  // verbose logs
  verbose(message: string, context?: string) {
    this.logger.verbose(message, context || 'App');
  }
}
