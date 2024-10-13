import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Observable, interval, map, switchMap } from 'rxjs';

@Injectable()
export class FlightDataService {
  constructor(private configService: ConfigService) {}

  // apiUrl retrieve any state vector of the OpenSky
  // The bounding box is set to Singapore
  // This so that we can get the flight data around Singapore
  private readonly apiUrl =
    'https://opensky-network.org/api/states/all?lamin=1.1733&lomin=103.5702&lamax=1.4774&lomax=104.1322';

  sse(): Observable<MessageEvent> {
    const username = this.configService.get<string>('OPENSKY_USERNAME');
    const password = this.configService.get<string>('OPENSKY_PASSWORD');
    
    return interval(5000).pipe(
      switchMap(async () => {
        try {
          // Fetch the flight data from the OpenSky API
          const response = await axios.get(this.apiUrl, {
            auth: {
              username: username,
              password: password,
            },
          });
          const flightData = response.data;

          // Create a MessageEvent with the retrieved flight data
          return new MessageEvent('message', {
            data: flightData,
          });
        } catch (error) {
          console.error('Error fetching flight data:', error);
          // You might want to return an error message or some fallback data here
          return new MessageEvent('message', {
            data: { error: 'Failed to fetch flight data' },
          });
        }
      }),
    );
  }
}
