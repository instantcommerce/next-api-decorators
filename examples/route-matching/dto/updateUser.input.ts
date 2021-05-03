import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserInput {
  @IsNotEmpty()
  @IsOptional()
  public name?: string;

  @IsEmail()
  @IsOptional()
  public email?: string;
}
