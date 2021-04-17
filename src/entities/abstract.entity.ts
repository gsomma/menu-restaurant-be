import { Column, VersionColumn, CreateDateColumn, UpdateDateColumn, BeforeUpdate, DeleteDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export abstract class AbstractEntity {

  @Exclude()
  @VersionColumn({ default: 1 })
  recVer: number;

  @Exclude()
  @Column({ type: 'varchar', length: 50, nullable: true })
  userIns: string;

  @Exclude()
  @Column({ type: 'varchar', length: 50, nullable: true })
  userUpd: string;

  @Exclude()
  @CreateDateColumn({ type: "timestamp without time zone", default: () => "CURRENT_TIMESTAMP(6)" })
  dateIns: Date;

  @Exclude()
  //@UpdateDateColumn({ name: "dta_upd",  type: "timestamp without time zone", default: () => "CURRENT_TIMESTAMP(6)", nullable: true  })
  // @UpdateDateColumn({ name: "dta_upd",  type: "timestamp without time zone", nullable: true, default: null })
  @UpdateDateColumn({ type: "timestamp without time zone", nullable: true, default: null })
  dateUpd: Date;

  @Exclude()
  @DeleteDateColumn({ type: "timestamp without time zone", nullable: true })
  dateDel: Date;

  @Exclude()
  @BeforeUpdate()
  public beforeUpdate(): void {
    this.dateUpd = new Date();
    if (this.recVer == undefined || this.recVer == null) {
      this.recVer = 1;
    } else {
      this.recVer++;
    }
  }

}
