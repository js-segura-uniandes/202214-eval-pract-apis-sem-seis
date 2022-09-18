import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermarketEntity } from './supermarket.entity';
import { SupermarketService } from './supermarket.service';
import { url } from 'inspector';

describe('SupermarketService', () => {
  let service: SupermarketService;
  let repository: Repository<SupermarketEntity>;
  let supermarketList: SupermarketEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermarketService],
    }).compile();

    service = module.get<SupermarketService>(SupermarketService);
    repository = module.get<Repository<SupermarketEntity>>(getRepositoryToken(SupermarketEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermarketList = [];
    for(let i = 0; i < 5; i++){
        const supermarket: SupermarketEntity = await repository.save({
        name: faker.random.alpha(11),
        longitude: parseInt(faker.address.longitude()),
        latitude: parseInt(faker.address.latitude()),
        webSite : faker.internet.url(),
        });
        supermarketList.push(supermarket)
   }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermarkets', async () => {
    const supermarkets: SupermarketEntity[] = await service.findAll();
    expect(supermarkets).not.toBeNull();
    expect(supermarkets).toHaveLength(supermarketList.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const storedSupermarket: SupermarketEntity = supermarketList[0];
    const supermarket: SupermarketEntity = await service.findOne(storedSupermarket.id);
    expect(supermarket).not.toBeNull();
    expect(supermarket.name).toEqual(storedSupermarket.name)
 
    expect(supermarket.latitude).toEqual(storedSupermarket.latitude)
    expect(supermarket.longitude).toEqual(storedSupermarket.longitude)
    expect(supermarket.webSite).toEqual(storedSupermarket.webSite)
  });

  it('findOne should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found")
  });

  it('create should return a new supermarket', async () => {
    const supermarket: SupermarketEntity = {
      id: "",
      name: faker.random.alpha(11),
      longitude: parseInt(faker.address.latitude()),
      latitude: parseInt(faker.address.latitude()),
      webSite: faker.internet.url(),
      cities: [],
    }

    const newSupermarket: SupermarketEntity = await service.create(supermarket);

    expect(newSupermarket).not.toBeNull();

    const storedSupermarket: SupermarketEntity = await repository.findOne({where: {id: newSupermarket.id}})
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toEqual(newSupermarket.name)
    expect(storedSupermarket.longitude).toEqual(newSupermarket.longitude)
    expect(storedSupermarket.latitude).toEqual(newSupermarket.latitude)
    expect(storedSupermarket.webSite).toEqual(newSupermarket.webSite)
  });

  it('create should throw an exception for an invalid supermarket name', async () => {
    const supermarket: SupermarketEntity = {
      id: "",
      name: "",
      longitude: parseInt(faker.address.longitude()),
      latitude: parseInt(faker.address.latitude()),
      webSite : faker.internet.url(),
      cities: [],
    }

    await expect(() => service.create(supermarket)).rejects.toHaveProperty("message", "The supermarket must have more than 10 characters!")
  });

  it('update should modify a supermarket', async () => {
    const supermarket: SupermarketEntity = supermarketList[0];
    supermarket.name = faker.random.alpha(11);

    const updatedSupermarket: SupermarketEntity = await service.update(supermarket.id, supermarket);
    expect(updatedSupermarket).not.toBeNull();
  
    const storedSupermarket: SupermarketEntity = await repository.findOne({ where: { id: supermarket.id } })
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toEqual(supermarket.name)
  });

  it('update should throw an exception for an invalid supermarket', async () => {
    const supermarket: SupermarketEntity = supermarketList[0];
    supermarket.id = ""
    supermarket.name = faker.random.alpha(11);

    await expect(() => service.update(supermarket.id, supermarket)).rejects.toHaveProperty("message", "The supermarket with the given id was not found")
  });

  it('update should throw an exception for an invalid supermarket name', async () => {
    const supermarket: SupermarketEntity = supermarketList[0];
    supermarket.name = "";

    await expect(() => service.update(supermarket.id, supermarket)).rejects.toHaveProperty("message", "The supermarket must have more than 10 characters!")
  });

  it('delete should remove a supermarket', async () => {
    const supermarket: SupermarketEntity = supermarketList[0];
    await service.delete(supermarket.id);
  
    const deletedSupermarket: SupermarketEntity = await repository.findOne({ where: { id: supermarket.id } })
    expect(deletedSupermarket).toBeNull();
  });

  it('delete should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found")
  });

});
