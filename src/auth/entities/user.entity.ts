import {Column, Entity, OneToMany, Relation} from 'typeorm';
import {BaseEntity} from '../../common/entity';
import {UserRole} from '../types';


@Entity()
export class User extends BaseEntity {
  @Column({type: 'varchar'})
  name: string;

  @Column({type: 'varchar'})
  email: string;

  @Column({type: 'varchar'})
  password: string;

  @Column({type: 'varchar', length: 50})
  phone: string;

  @Column({type: 'enum', enum: UserRole})
  role: UserRole;

  @Column({nullable: true})
  regNo: string;

  @Column({default: false})
  isPersonalInfoVerified: boolean;


}
