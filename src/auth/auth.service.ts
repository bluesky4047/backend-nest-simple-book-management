import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Auth } from './auth.entity';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  // Generate JWT Token
  generateToken(user: Auth): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  // REGISTER / CREATE USER
  async create(email: string, password: string): Promise<Auth> {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = this.authRepository.create({
        email,
        password: hashedPassword,
      });

      return await this.authRepository.save(user);
    } catch (error) {
      // MySQL duplicate entry
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exists');
      }

      throw error; // error lain biarin naik
    }
  }

  // FIND BY EMAIL (for login)
  async findByEmail(email: string): Promise<Auth | null> {
    return this.authRepository.findOne({
      where: { email },
    });
  }

  // Login
  async login(email: string, password: string): Promise<Auth> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }
}
