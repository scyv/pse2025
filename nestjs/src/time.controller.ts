import { Controller, Get } from '@nestjs/common';

@Controller('time')
export class TimeController {
  @Get()
  getCurrentTime(): string {
    return { currentTime: new Date().toLocaleTimeString('de-DE') };
  }
}
