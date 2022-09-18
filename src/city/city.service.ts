import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { allowedCountries } from './allowed-countries';
import { CityEntity } from './city.entity';

@Injectable()
export class CityService {

    validCountries = ['Argentina', 'Ecuador', 'Paraguay']
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) {}

  async findAll(): Promise<CityEntity[]> {
    return await this.cityRepository.find({ relations: ['supermarkets'] });
  }

  async findOne(id: string): Promise<CityEntity> {
    const city: CityEntity = await this.cityRepository.findOne({
      where: { id },
      relations: ['supermarkets'],
    });
    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return city;
  }

  async create(city: CityEntity): Promise<CityEntity> {
    this.validateCountry(city);
    return await this.cityRepository.save(city);
  }

  async update(id: string, city: CityEntity): Promise<CityEntity> {
    this.validateCountry(city);
    const persistedCity: CityEntity = await this.cityRepository.findOne({
      where: { id },
      relations: ['supermarkets'],
    });
    if (!persistedCity)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    Object.assign(persistedCity, city);
    return await this.cityRepository.save(persistedCity);
  }

  async delete(id: string) {
    const city: CityEntity = await this.cityRepository.findOne({
      where: { id },
      relations: ['supermarkets'],
    });
    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    await this.cityRepository.remove(city);
  }

  private validateCountry(city: CityEntity){
    if((allowedCountries.filter((i)=>i==city.country)).length==0){
        throw new BusinessLogicException("The country is not authorized", BusinessError.PRECONDITION_FAILED);
    }
  }
}
