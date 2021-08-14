import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDto } from './models/user-update.dto';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,

    private authService: AuthService,
  ) {}

  @Get()
  async all(@Query('page') page = 1): Promise<User[]> {
    return await this.userService.paginate(page, {
      relations: ['role'],
    });
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return this.userService.findOne(
      { id },
      {
        relations: ['role'],
      },
    );
  }

  @Post()
  async create(@Body() body: UserCreateDto): Promise<User> {
    const password = await bcrypt.hash('1234', 12);

    const { role_id, ...data } = body;

    return this.userService.create({
      ...data,
      password,
      role: { id: role_id },
    });
  }

  @Put('info')
  async updateInfo(@Req() request: Request, @Body() body: UserUpdateDto) {
    const id = await this.authService.getUserId(request);

    await this.userService.update(id, body);

    return this.userService.findOne({ id });
  }

  @Put('password')
  async updatePassword(
    @Req() request: Request,
    @Body('password') password: string,
    @Body('password_confirm') password_confirm: string,
  ) {
    if (password !== password_confirm) {
      throw new BadRequestException('패스워드가 일치하지 않습니다!');
    }
    const id = await this.authService.getUserId(request);
    const hashed = await bcrypt.hash(password, 12);

    await this.userService.update(id, { password: hashed });

    return {
      message: '비밀번호 변경완료',
    };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: UserUpdateDto) {
    const { role_id, ...data } = body;

    await this.userService.update(id, {
      ...data,
      role: {
        id: role_id,
      },
    });

    return this.userService.findOne(
      { id },
      {
        relations: ['role'],
      },
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
