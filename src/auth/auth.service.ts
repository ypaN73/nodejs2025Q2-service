import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshDto } from './dto/refresh.dto';

// Helper function to parse time strings to seconds (also exported for reuse)
export function parseTimeToSeconds(timeString: string): number {
  const match = timeString.match(/^(\d+)([smhd])$/);
  if (!match) return 15 * 60; // Default 15 minutes

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 60 * 60 * 24;
    default:
      return 15 * 60;
  }
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { login: signUpDto.login },
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        login: signUpDto.login,
        password: hashedPassword,
      },
    });

    const tokens = await this.generateTokens(user.id, user.login);
    return {
      id: user.id,
      login: user.login,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { login: loginDto.login },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN);
    }

    const passwordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN);
    }

    const tokens = await this.generateTokens(user.id, user.login);
    return tokens;
  }

  async refresh(refreshDto: RefreshDto) {
    if (!refreshDto.refreshToken) {
      throw new HttpException(
        'Refresh token required',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        refreshDto.refreshToken,
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY || 'refresh_secret',
        },
      );

      const tokens = await this.generateTokens(payload.userId, payload.login);
      return tokens;
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.FORBIDDEN);
    }
  }

  private async generateTokens(userId: string, login: string) {
    const payload = { userId, login };

    // Convert string time to number of seconds
    const accessTokenExpiresIn = parseTimeToSeconds(
      process.env.TOKEN_EXPIRE_TIME || '15m',
    );
    const refreshTokenExpiresIn = parseTimeToSeconds(
      process.env.TOKEN_REFRESH_EXPIRE_TIME || '7d',
    );

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY || 'secret_key',
        expiresIn: accessTokenExpiresIn,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY || 'refresh_secret',
        expiresIn: refreshTokenExpiresIn,
      }),
    };
  }
}
