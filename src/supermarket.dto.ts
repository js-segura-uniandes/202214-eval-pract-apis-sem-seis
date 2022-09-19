 import {IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class SupermarketDto {

    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNumber()
    longitude: number;
  
    @IsNumber()
    latitude: number;

    @IsString()
    webSite: string;

}

