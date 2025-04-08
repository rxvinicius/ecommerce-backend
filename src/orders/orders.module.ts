import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [AuthModule, PrismaModule],
})
export class OrdersModule {}
