import {PickType} from "@nestjs/swagger";
import {CreateUserDto} from "./create-user.dto";

export class UpdateReqDto extends PickType(CreateUserDto, ['name', 'phone'] as const) {
};
