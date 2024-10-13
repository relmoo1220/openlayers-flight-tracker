import { Controller, Sse } from '@nestjs/common';
import { FlightDataService } from './flight-data.service';
import { Observable } from 'rxjs';

@Controller('flight-data')
export class FlightDataController {
  constructor(private readonly flightDataService: FlightDataService) {}

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.flightDataService.sse();
  }
}
