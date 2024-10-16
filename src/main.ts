import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { GlobalRpcExceptionFilter } from './filters/global-rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'property',
          //brokers: ['host.docker.internal:9092'],
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'admin-consumer',
        },
      },
    },
  );
  app.useGlobalFilters(new GlobalRpcExceptionFilter());
  app.listen();
}
bootstrap();
