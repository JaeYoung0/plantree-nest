import { Body, Controller, Get, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get()
  async all() {
    return this.permissionService.all();
  }

  @Post()
  async create(@Body('name') name: string) {
    return this.permissionService.create({ name });
  }
}
