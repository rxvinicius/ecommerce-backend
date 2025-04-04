import { Module } from '@nestjs/common';
import { RoleAccessGuard } from './guards/role-access.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [RoleAccessGuard],
  exports: [RoleAccessGuard],
})
export class AccessControlModule {}
