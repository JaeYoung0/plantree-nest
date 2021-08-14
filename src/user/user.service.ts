import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';

@Injectable()
export class UserService extends AbstractService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async paginate(page = 1, options?): Promise<any> {
    const result = await super.paginate(page, options);

    const { data: users, meta } = result;

    return {
      data: users.map((user) => {
        const { password, ...data } = user;
        return data;
      }),
      meta,
    };
  }
}
