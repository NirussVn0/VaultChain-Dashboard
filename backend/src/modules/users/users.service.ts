import { Injectable, Logger } from "@nestjs/common";
import { User, UserRole } from "@prisma/client";

import { PrismaService } from "../../common/prisma/prisma.service";

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  displayName?: string;
  roles?: UserRole[];
}

/**
 * UsersService encapsulates all persistence logic for account records.
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createUser(input: CreateUserInput): Promise<User> {
    const roles = input.roles && input.roles.length > 0 ? input.roles : [UserRole.TRADER];
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        displayName: input.displayName,
        roles,
      },
    });

    this.logger.log(`Created user ${user.id} with roles ${user.roles.join(",")}`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async touchLastLogin(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  async incrementPasswordVersion(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordVersion: {
          increment: 1,
        },
      },
    });
  }
}
