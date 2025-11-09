import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

/**
 * DTO representing login payload for local auth.
 */
export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(12)
  @MaxLength(128)
  @Matches(/[A-Z]/, { message: "password must contain at least one uppercase letter" })
  @Matches(/[a-z]/, { message: "password must contain at least one lowercase letter" })
  @Matches(/\d/, { message: "password must contain at least one digit" })
  @Matches(/[^A-Za-z0-9]/, { message: "password must contain at least one special character" })
  password!: string;
}
