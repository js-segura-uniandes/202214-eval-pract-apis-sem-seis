import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { SupermarketEntity } from './supermarket.entity';

@Injectable()
export class SupermarketService {
  constructor(
    @InjectRepository(SupermarketEntity)
    private readonly supermarketRepository: Repository<SupermarketEntity>,
  ) {}

  async findAll(): Promise<SupermarketEntity[]> {
    return await this.supermarketRepository.find({ relations: ['cities'] });
  }

  async findOne(id: string): Promise<SupermarketEntity> {
    const supermarket: SupermarketEntity =
      await this.supermarketRepository.findOne({
        where: { id },
        relations: ['cities'],
      });
    if (!supermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return supermarket;
  }

  async create(supermarket: SupermarketEntity): Promise<SupermarketEntity> {
    this.checkSupermarket(supermarket);
    return await this.supermarketRepository.save(supermarket);
  }

  async update(
    id: string,
    supermarket: SupermarketEntity,
  ): Promise<SupermarketEntity> {
    
    const persistedSupermarket: SupermarketEntity =
      await this.supermarketRepository.findOne({
        where: { id },
        relations: ['cities'],
      });
    if (!persistedSupermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
      this.checkSupermarket(supermarket);
    Object.assign(persistedSupermarket, supermarket);
    return await this.supermarketRepository.save(persistedSupermarket);
  }

  async delete(id: string) {
    const supermarket: SupermarketEntity =
      await this.supermarketRepository.findOne({
        where: { id },
        relations: ['cities'],
      });
    if (!supermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.supermarketRepository.remove(supermarket);
  }

  private checkSupermarket(supermarket: SupermarketEntity) {
    if (supermarket.name.length <= 10)
      throw new BusinessLogicException(
        'The supermarket must have more than 10 characters!',
        BusinessError.PRECONDITION_FAILED,
      );
  }
}
