import { UserRole } from "@prisma/client";

export class AuthenticatedUserDto {
  id!: string;
  email!: string;
  displayName?: string | null;
  roles!: UserRole[];
  createdAt!: Date;
  lastLoginAt?: Date | null;
}

export class AuthResponseDto {
  accessToken!: string;
  expiresIn!: number;
  user!: AuthenticatedUserDto;
}
