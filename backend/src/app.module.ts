import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightDataModule } from './flight-data/flight-data.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), FlightDataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
