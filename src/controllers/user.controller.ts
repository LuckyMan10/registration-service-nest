import { Controller, Get, Post, Put, Delete, Res, Req } from '@nestjs/common';
import { Injectable, Scope, Inject } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserRegDto } from 'dtos/UserRegDto';
import {UserLoginDto} from 'dtos/userLoginDto';
import { UserService } from 'services/user.service';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import {PayloadUser} from 'interfaces/userPayload.interface';
import {UserData} from 'interfaces/userData.interface';

@Controller('user')
@Injectable()
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Post('registration')
    async registration(
        @Res({passthrough: true}) response: Response,
        @Body() userRegDto: UserRegDto
        ): Promise<UserData<PayloadUser> | HttpException> {
        try {
            const { username, password, email } = userRegDto;
            const userData = await this.userService.registration({
                email,
                password,
                username
            });
            response.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return userData;
        } catch(e) {
            return new HttpException({message: e}, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('login')
    async login(
        @Res({passthrough: true}) response: Response,
        @Body() userLoginDto: UserLoginDto
    ): Promise<UserData<PayloadUser> | HttpException> {
        try {
            const {email, password} = userLoginDto;
            const userData = await this.userService.login({email, password});
            response.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return userData
        } catch(e) {
            return new HttpException({message: e}, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('refresh')
    async refresh(
        @Res({passthrough: true}) response: Response,
        @Req() request: Request
    ): Promise<UserData<PayloadUser> | HttpException> {
        try {
            const {refreshToken} = request.cookies;
            if (!refreshToken || refreshToken === "undefined") {
                throw "Требуется авторизация";
            }
            const userData = await this.userService.refresh(refreshToken);
            response.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return userData;
        } catch(e) {
            return new HttpException({message: e}, HttpStatus.UNAUTHORIZED);
        }
    }
    @Delete('delete')
    async delete(
        @Res({passthrough: true}) response: Response,
        @Req() request: Request
    ): Promise<HttpException | { message: string }> {
        try {
            const {refreshToken} = request.cookies;
            if (!refreshToken || refreshToken === "undefined") {
                throw "Требуется авторизация";
            }
            const removeUser = await this.userService.remove(refreshToken);
            response.clearCookie("refreshToken");
            if(removeUser && removeUser.deletedCount === 1) {
                return {message: "Аккаунт успешно удален"}
            } else {
                throw "При удалении аккаунта произошла ошибка"
            }
        } catch(e) {
            return new HttpException({message: e}, HttpStatus.FORBIDDEN);
        }
    }

    @Get('logout')
    async logout(
        @Res({passthrough: true}) response: Response,
        @Req() request: Request
    ): Promise<HttpException | { message: string }>{
        try {
            const {refreshToken} = request.cookies;
            if (!refreshToken || refreshToken === "undefined") {
                throw "Требуется авторизация";
            }
            const token = await this.userService.logout(refreshToken);
            response.clearCookie("refreshToken");
            if(token && token.deletedCount === 1) {
                return {message: "Вы вышли из аккаунта"}
            } else {
                throw "При выходе из аккаунта произошла ошибка"
            }
        } catch(e) {
            throw e;
        }
    }
}
