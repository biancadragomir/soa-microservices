import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { PreauthMiddleware } from './auth/preauth.middleware';
import { SWAPI_MAIN_SERVICE, SWAPI_CRUD_SERVICE } from './my.constants';

@Module({
  imports: [
    ClientsModule.register([
      { name: SWAPI_MAIN_SERVICE, transport: Transport.TCP },
      {
        name: SWAPI_CRUD_SERVICE,
        transport: Transport.TCP,
        options: { port: 3005 },
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreauthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
