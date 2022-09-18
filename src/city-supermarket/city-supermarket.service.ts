import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityEntity } from '../city/city.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CitySupermarketService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    @InjectRepository(SupermarketEntity)
    private readonly supermarketRepository: Repository<SupermarketEntity>,
  ) {}

  async addSupermarketToCity(
    cityId: string,
    supermarketId: string,
  ): Promise<CityEntity> {
    const supermarket: SupermarketEntity =
      await this.supermarketRepository.findOne({
        where: { id: supermarketId },
        relations: ['cities'],
      });
    if (!supermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const city: CityEntity = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    city.supermarkets = [...city.supermarkets, supermarket];
    return await this.cityRepository.save(city);
  }

  async findSupermarketsFromCity(cityId: string): Promise<SupermarketEntity[]> {
    const city: CityEntity = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return city.supermarkets;
  }

  async findSupermarketFromCity(
    cityId: string,
    supermarketId: string,
  ): Promise<SupermarketEntity> {
    const city: CityEntity = await this.validateCityAndSupermarket(
      cityId,
      supermarketId,
    );
    return city.supermarkets.find((s) => s.id === supermarketId);
  }

  async updateSupermarketsFromCity(
    cityId: string,
    supermarkets: SupermarketEntity[],
  ): Promise<CityEntity> {
    const city: CityEntity = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    for (let i = 0; i < supermarkets.length; i++) {
      const supermarket: SupermarketEntity =
        await this.supermarketRepository.findOne({
          where: { id: supermarkets[i].id },
          relations: ['cities'],
        });
      if (!supermarket)
        throw new BusinessLogicException(
          'The supermarket with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }
    city.supermarkets = supermarkets;
    return await this.cityRepository.save(city);
  }

  async deleteSupermarketFromCity(cityId: string, supermarketId: string) {
    const city: CityEntity = await this.validateCityAndSupermarket(
      cityId,
      supermarketId,
    );
    city.supermarkets = city.supermarkets.filter((s) => s.id !== supermarketId);
    await this.cityRepository.save(city);
  }

  async validateCityAndSupermarket(
    cityId: string,
    supermarketId: string,
  ): Promise<CityEntity> {
    const supermarket: SupermarketEntity =
      await this.supermarketRepository.findOne({
        where: { id: supermarketId },
        relations: ['cities'],
      });
    if (!supermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const city: CityEntity = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const CitySupermarket: SupermarketEntity = city.supermarkets.find(
      (s) => s.id === supermarket.id,
    );
    if (!CitySupermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id is not associated to the city',
        BusinessError.PRECONDITION_FAILED,
      );
    return city;
  }
}
