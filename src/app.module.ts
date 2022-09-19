import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CityEntity } from './city/city.entity';
import { CityModule } from './city/city.module';
import { SupermarketEntity } from './supermarket/supermarket.entity';
import { SupermarketModule } from './supermarket/supermarket.module';
import { CitySupermarketModule } from './city-supermarket/city-supermarket.module';
import { CityService } from './city/city.service';
import { SupermarketService } from './supermarket/supermarket.service';
import { CitySupermarketService } from './city-supermarket/city-supermarket.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [CityEntity, SupermarketEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    CityModule,
    SupermarketModule,
    CitySupermarketModule    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}