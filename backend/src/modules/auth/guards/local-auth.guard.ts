import { BadRequestException, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { LoginDto } from "../dto/login.dto";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const dto = plainToInstance(LoginDto, request.body);
    const validationErrors = await validate(dto);
    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }

    return (await super.canActivate(context)) as boolean;
  }
}
