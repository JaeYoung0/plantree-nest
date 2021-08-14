import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginateResult } from './PaginateResult.interface';

@Injectable()
export abstract class AbstractService<T> {
  protected constructor(protected readonly repository: Repository<T>) {}

  async all(options?): Promise<T[]> {
    return this.repository.find(options);
  }

  async paginate(page = 1, options?): Promise<PaginateResult<T>> {
    const take = 15;

    const [data, total] = await this.repository.findAndCount({
      take,
      skip: (page - 1) * take,
      ...options,
    });

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async create(data): Promise<T> {
    return this.repository.save(data);
  }

  async findOne(condition, options?): Promise<T> {
    return this.repository.findOne(condition, options);
  }

  async update(id: number, data): Promise<any> {
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<any> {
    return this.repository.delete(id);
  }
}
