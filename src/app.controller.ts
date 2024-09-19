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
    return await this.appService.signin(data.value);
  }

  @MessagePattern('admin_signup')
  async adminSignUp(data: any) {
    return await this.appService.register(data.value);
  }

  @MessagePattern('register')
  async register(data: any) {
    return await this.appService.register(data.value);
  }
}
