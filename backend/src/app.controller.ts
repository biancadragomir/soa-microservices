import {
  Controller,
  Get,
  Inject,
  Req,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { SWAPI_CRUD_SERVICE, SWAPI_MAIN_SERVICE } from './my.constants';

@Controller()
export class AppController {
  constructor(
    @Inject(SWAPI_MAIN_SERVICE) private readonly client: ClientProxy,
    @Inject(SWAPI_CRUD_SERVICE) private readonly clientCrud: ClientProxy,
  ) {}

  @Get('vehicles')
  getVehicles(): Observable<any> {
    this.client.emit('vehicles-event', {});
    const pattern = { cmd: 'vehicles' };
    console.log('Sending vehicles event...');
    return this.client.send(pattern, {});
  }

  @Post('addVehicles')
  postVehicle(@Body() message: any) {
    console.log('sending with message=', message);
    this.clientCrud.emit('add-vehicles-event', message);
    const pattern = { cmd: 'add-vehicles' };
    console.log('Sending ADD vehicles event...');
    return this.clientCrud.send(pattern, message);
  }

  @Delete('deleteVehicles')
  deleteVehicle(@Body() message: any) {
    console.log('DELETE sending with message=', message);
    const pattern = { cmd: 'delete-vehicles' };
    console.log('Sending DELETE vehicles event...');
    return this.clientCrud.send(pattern, message);
  }
}
