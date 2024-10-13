import { Module } from '@nestjs/common';
import { FlightDataService } from './flight-data.service';
import { FlightDataController } from './flight-data.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [FlightDataController],
  providers: [FlightDataService],
})
export class FlightDataModule {}
