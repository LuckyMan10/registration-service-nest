import { Injectable, Inject } from '@nestjs/common';
import { TokenDocument, Token } from 'schemas/token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import {PayloadUser} from 'interfaces/userPayload.interface';

@Injectable()
export class TokenService {
    constructor(
        @InjectModel(Token.name)
        private readonly tokenModel: Model<TokenDocument>
    ) {}

    generateTokens(payload: PayloadUser): {accessToken: string, refreshToken: string} {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: "1d",
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: "30d",
        });
        return {
            accessToken,
            refreshToken
        }
    }
    validateAccessToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch(e) {
            throw e;
        }
    }
    validateRefreshToken(token: string)  {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET) as PayloadUser;
            return userData;
        } catch(e) {
            throw e;
        }
    }
    async saveToken(userId: string, refreshToken: string) {
        try {
            const tokenData = await this.tokenModel.findOne({ userId });
            if(tokenData) {
                tokenData.refreshToken = refreshToken;
                return tokenData.save();
            }
            const token = await this.tokenModel.create({ userId, refreshToken });
            return token;
        } catch(e) {
            throw e;
        }
    }
    async removeToken(refreshToken: string) {
        try {
            const tokenData = await this.tokenModel.deleteOne({ refreshToken });
            return tokenData;
        } catch(e) {
            throw e;
        }
    }
    async findToken(refreshToken: string) {
        try {
            const tokenData = await this.tokenModel.findOne({ refreshToken });
            return tokenData;
        } catch(e) {
            throw e;
        }
    }
}