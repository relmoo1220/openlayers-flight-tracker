import { Test, TestingModule } from '@nestjs/testing';
import { FlightDataController } from './flight-data.controller';
import { FlightDataService } from './flight-data.service';

describe('FlightDataController', () => {
  let controller: FlightDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightDataController],
      providers: [FlightDataService],
    }).compile();

    controller = module.get<FlightDataController>(FlightDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
