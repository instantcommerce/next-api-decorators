import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserInput {
  @IsNotEmpty()
  public name!: string;

  @IsEmail()
  @IsNotEmpty()
  public email!: string;
}
