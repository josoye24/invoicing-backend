import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';

// @Module({
//   imports: [UsersModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'postgres',
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
