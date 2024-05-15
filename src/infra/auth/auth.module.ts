import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './guards/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { EnvService } from '../env/env.service';

@Module({
  providers: [
    EnvService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const publicKey = env.get('PUBLIC_KEY_JWT');
        const privateKey = env.get('PRIVATE_KEY_JWT');

        return {
          signOptions: { algorithm: 'RS256', expiresIn: '7d' },
          privateKey: Buffer.from(privateKey, 'ascii'),
          publicKey: Buffer.from(publicKey, 'ascii'),
        };
      },
    }),
  ],
})
export class AuthModule {}
