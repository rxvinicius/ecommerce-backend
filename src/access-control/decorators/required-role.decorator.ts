import { SetMetadata } from '@nestjs/common';

export const RequiredRole = (role: string) => SetMetadata('requiredRole', role);
