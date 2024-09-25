import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('admin_login')
  async adminLogin(data: any) {
    return await this.appService.signin(data.value)
      .then(result => result)
      .catch(error => error)
  }

  @MessagePattern('admin_signup')
  async adminSignUp(data: any) {
    return await this.appService.register(data.value)
      .then(result => result)
      .catch(error => error);
  }

  @MessagePattern('admin_create_role')
  async adminCreateRole(data: any) {
    return await this.appService.createRole(data.value.name, data.value.permission)
      .then(result => result)
      .catch(error => error);
  }

  @MessagePattern('admin_update_role')
  async adminUpdateRole(data: any) {
    return await this.appService.updateRole(data.value.isIdDTO, data.value.updateRoleDTO)
      .then(result => result)
      .catch(error => error);
  }
}
