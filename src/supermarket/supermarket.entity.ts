import { CityEntity } from 'src/city/city.entity';
import { Column, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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
