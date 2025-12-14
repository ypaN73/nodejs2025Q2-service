import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

// Helper function to parse time strings to seconds
function parseTimeToSeconds(timeString: string): number {
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

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'secret_key',
      signOptions: {
        expiresIn: parseTimeToSeconds(process.env.TOKEN_EXPIRE_TIME || '15m'),
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, AuthService],
})
export class AuthModule {}
