import { AbstractService } from 'src/common/abstract.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService extends AbstractService<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    super(orderRepository);
  }

  async paginate(page = 1, options?): Promise<any> {
    const result = await super.paginate(page, options);

    const { data, meta } = result;

    return {
      data: data.map((order: Order) => ({
        id: order.id,
        name: order.name,
        email: order.email,
        total: order.total,
        created_at: order.created_at,
        order_items: order.order_items,
      })),
      meta,
    };
  }
}
