### comandos usados en el tutorial 

Crear un nuevo modulo 
  nest g mo city
  nest g mo supermarket

Crear la entidad Ciudad, Supermecado
nest g cl city/city.entity --no-spec
nest g cl supermarket/supermarket.entity --no-spec


Install type ORM 
npm install --save @nestjs/typeorm typeorm


comandos para la logica de negocio 

nest g s city
nest g s supermarket

Crear asociación  modulo 
nest g mo city-supermarket

Crear asociacion service 
nest g s city-supermarket
