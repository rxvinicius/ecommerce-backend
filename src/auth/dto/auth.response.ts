import { ApiProperty } from '@nestjs/swagger';

export class AuthUserResponse {
  @ApiProperty({ example: 'cluqn6m070001tqv04g4dfzzp' })
  id: string;

  @ApiProperty({ example: 'joao@email.com' })
  email: string;

  @ApiProperty({ example: 'João Silva' })
  name: string;

  @ApiProperty({ example: 'CUSTOMER' })
  role: string;
}

export class AuthResponse {
  @ApiProperty({ type: AuthUserResponse })
  user: AuthUserResponse;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;
}
