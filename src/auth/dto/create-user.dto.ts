import {ApiProperty} from "@nestjs/swagger";
import {UserRole} from "../types";
import {IsEmail, IsEnum, IsNotEmpty, IsString, Length, Matches, MaxLength} from "class-validator";

export class CreateUserDto {

  @ApiProperty({required: true, example: 'nestjs@test.com'})
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(30)
  email: string;

  @ApiProperty({required: true, example: '1234'})
  @IsNotEmpty()
  //@Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$^&*]).{10,30}$/)
  password: string;

  @ApiProperty({required: true, example: '홍길동'})
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @ApiProperty({required: true, example: '010-1111-1111'})
  @IsString()
  @IsNotEmpty()
  @Matches(/^010-\d{4}-\d{4}$/)
  @Length(11)
  phone: string;

  @ApiProperty({required: true, enum: UserRole, example: UserRole.user})
  @IsEnum(UserRole)
  role: UserRole;
}


