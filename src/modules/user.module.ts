import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from "controllers/user.controller";
import { UserService } from 'services/user.service';
import { UserSchema } from 'schemas/user.schema';
import {TokenSchema} from 'schemas/token.schema';
import {TokenService} from 'services/token.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema}]),
        MongooseModule.forFeature([{name: 'Token', schema: TokenSchema}])
    ],
    controllers: [UserController],
    providers: [UserService, TokenService]
})
export class UserModule { }