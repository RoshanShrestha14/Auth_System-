import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLogger  {
  private readonly logger = new Logger('AppLogger');

  // log for general info
  log(message: string, context?: string) {
    this.logger.log(message, context || 'App');
  }

  // log for errors
  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context || 'App');
  }

}
