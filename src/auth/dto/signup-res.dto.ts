import {ApiProperty} from "@nestjs/swagger";

export class SignupResDto {
  @ApiProperty({required: true})
  id: string;
  @ApiProperty({required: true})
  name: string;
  @ApiProperty({required: true})
  email: string;
  @ApiProperty({required: true})
  phone: string;
};
