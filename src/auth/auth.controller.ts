import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import {
  LoginResponse,
  RegisterResponse,
} from '../common/utils/response.utils';
import { generate } from 'rxjs';

@Controller('auth')
export class AuthController {
  authRepository: any;
  constructor(private readonly authService: AuthService) {}

  // REGISTER
  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const data = await this.authService.create(email, password);

    return RegisterResponse.success('User registered successfully', data);
  }

  // LOGIN
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const data = await this.authService.login(email, password);

    const token = this.authService.generateToken(data);

    return LoginResponse.success('User logged in successfully', token, data);
  }
}
