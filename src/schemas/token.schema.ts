import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
    @Prop({required: true})
    userId: string

    @Prop({required: true})
    refreshToken: string
}

export const TokenSchema = SchemaFactory.createForClass(Token);