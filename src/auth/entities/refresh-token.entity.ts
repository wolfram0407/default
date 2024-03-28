import {BaseEntity} from "src/common/entity";
import {Column, Entity, JoinColumn, OneToOne} from "typeorm";
import {User} from "./user.entity";


@Entity()
export class RefreshToken extends BaseEntity {

  @Column()
  token: string;

  @Column()
  jti: string;

  @Column({type: 'timestamp'})
  expiresAt: Date;

  @OneToOne(() => User, (user) => user.refreshToken)
  @JoinColumn({name: 'user_id'})
  user: User;

  @Column({default: false})
  isRevoked: boolean;

}