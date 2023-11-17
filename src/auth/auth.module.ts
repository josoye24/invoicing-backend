import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
// import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ResponseHelper } from '../common/response.helper';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'abc123456',
      signOptions: { expiresIn: '3d' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  // providers: [JwtStrategy, UsersService],
  // exports: [PassportModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ResponseHelper],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
