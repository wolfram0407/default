import {PickType} from "@nestjs/swagger";
import {CreateUserDto} from "./create-user.dto";


export class LoginReqDto extends PickType(CreateUserDto, ['email', 'password'] as const) {
  email: string;
  password: string;
};
