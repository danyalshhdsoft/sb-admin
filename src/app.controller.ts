import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { EVENT_TOPICS } from './enums/event-topics.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('get_admin')
  async getUser(data: any) {
    //console.log(data);
    return await this.appService.getUser(data.value)
      .then(res => res)
      .catch(err => err);
  }

  @MessagePattern(EVENT_TOPICS.ADMIN_LOGIN)
  async adminLogin(data: any) {
    return await this.appService.signin(data.value)
      .then(result => result)
      .catch(error => error)
  }

  @MessagePattern(EVENT_TOPICS.REGISTER_AGENCY_QUERY)
  async registerAgencyQuery(data: any) {
    return await this.appService.registerQuery(data.value)
      .then(result => result)
      .catch(error => error);
  }

  @MessagePattern(EVENT_TOPICS.CREATE_AGENCY)
  async createAgency(data: any) {
    return await this.appService.createAgency(data.value)
      .then(result => result)
      .catch(error => error);
  }

  @MessagePattern(EVENT_TOPICS.DELETE_AGENCY)
  async deleteAgency(data: any) {
    return await this.appService.deleteAgency(data.value)
      .then(result => result)
      .catch(error => error);
  }

  @MessagePattern(EVENT_TOPICS.UPDATE_AGENCY)
  async updateAgency(data: any) {
    return await this.appService.updateAgency(data.value)
      .then(result => result)
      .catch(error => error);
  }

  @MessagePattern(EVENT_TOPICS.ADMIN_CREATE_ROLE)
  async adminCreateRole(data: any) {
    console.log(JSON.stringify(data.value.permissions));
    return await this.appService.createRole(data.value.name, data.value.permissions)
      .then(result => result)
      .catch(error => error);
  }

  @MessagePattern(EVENT_TOPICS.ADMIN_UPDATE_ROLE)
  async adminUpdateRole(data: any) {
    return await this.appService.updateRole(data.value.isIdDTO, data.value.updateRoleDTO)
      .then(result => result)
      .catch(error => error);
  }

  @MessagePattern(EVENT_TOPICS.ADMIN_GET_ROLES)
  async getRoles(data: any) {
    return await this.appService.getRoles(data.value.page, data.value.limit)
      .then(result => result)
      .catch(error => error);
  }

  @MessagePattern(EVENT_TOPICS.ADMIN_GET_ROLE_BY_ID)
  async getRoleById(data: any) {
    return await this.appService.getRoleById(data.value.sub)
      .then(result => result)
      .catch(error => error);
  }
}
