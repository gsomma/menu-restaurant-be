import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Exclude } from 'class-transformer';
import { UserProfile } from 'src/enums/user-profile.enum';


@Entity()
export class User extends AbstractEntity {

  // Every Entity must have "PrimaryGeneratedColumn".
  // Use "unique: true, " for unique column value
  @PrimaryGeneratedColumn({ comment: "Identificativo PK" })
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: 'Nominativo intestatario' })
  fullName: string;

  @Column({ type: 'varchar', length: 50, nullable: false, comment: 'Username', unique: true })
  username: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Password' })
  password: string;

  @Column({
    type: "enum",
    enum: UserProfile
  })
  profile: UserProfile;

  @Column({ name: 'isActive', type: 'boolean', default: true, comment: 'Indicatore di utenza attiva; true=attiva, false=non attiva' })
  isActive: boolean;
  

  constructor(partial?: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

}
