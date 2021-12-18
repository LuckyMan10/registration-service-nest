import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {UserModule} from './user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.CONNECT_URL),
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
