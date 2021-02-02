import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
const fetch = require('node-fetch');

@Controller()
export class AppController {
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
}
