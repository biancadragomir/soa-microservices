import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
const fetch = require('node-fetch');
import VehiclesRepo from './repo';

@Controller()
export class AppController {
  vehiclesRepo = new VehiclesRepo();

  // region GET VEHICLES
  @MessagePattern({ cmd: 'vehicles' })
  async vehicles() {
    const response = await fetch('https://swapi.dev/api/vehicles/');
    const data = await response.json();
    console.log(data);
    return data;
  }

  @EventPattern('vehicles-event')
  async handleFetchVehicles(data: any) {
    console.log('vehicles-event', data);
  }
  // endregion GET VEHICLES

  // region ADD VEHICLES
  @MessagePattern({ cmd: 'add-vehicles' })
  async addVehicle(data: any) {
    console.log('in add-vehicles also receiving: ', data);
    const response = await fetch(data.url);
    const fetchedVehicle = await response.json();
    this.vehiclesRepo.addVehicle(fetchedVehicle);
    return this.vehiclesRepo.getVehicles();
  }

  @EventPattern('add-vehicles-event')
  async handleAddVehicle(data: any) {
    // console.log('add-vehicles-event', data);
    // console.log('Just added ', data);
  }
  // endregion ADD VEHICLES

  // region DELETE
  @MessagePattern({ cmd: 'delete-vehicles' })
  async deleteVehicle(data: any) {
    console.log('in delete-vehicles also receiving: ', data);
    this.vehiclesRepo.deleteVehicle(data.name);
    return this.vehiclesRepo.getVehicles();
  }
}
