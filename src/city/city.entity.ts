import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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
