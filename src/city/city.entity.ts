import { SupermarketEntity } from 'src/supermarket/supermarket.entity';
import { Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export class CityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  totalPopulation: number;

  @ManyToMany(() => SupermarketEntity, supermarket => supermarket.cities)
  supermarkets: SupermarketEntity[];
}
