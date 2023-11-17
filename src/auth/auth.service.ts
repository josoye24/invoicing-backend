import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
// import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseHelper } from '../common/response.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private httpRes: ResponseHelper,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<any> {
    const { name, email, password } = signUpDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      this.httpRes.SendHttpError('Email already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    delete user.id;
    delete user.password;

    this.httpRes.SendHttpResponse(
      'User created successfully',
      HttpStatus.OK,
      user,
    );
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    //  validate email
    if (!user) {
      this.httpRes.SendHttpError(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    //  validate password
    if (!isPasswordMatched) {
      this.httpRes.SendHttpError(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = this.jwtService.sign({ id: user.id });
    delete user.password;
    const data = { token, user };

    this.httpRes.SendHttpResponse('Login successfully', HttpStatus.OK, data);
  }
}
