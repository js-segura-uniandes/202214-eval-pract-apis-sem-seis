import { CityEntity } from '../city/city.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SupermarketEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  longitude: number;

  @Column()
  latitude: number;

  @Column()
  webSite: string;

  @ManyToMany(() => CityEntity, cities => cities.supermarkets)
  @JoinTable()
  cities: CityEntity[];
}
