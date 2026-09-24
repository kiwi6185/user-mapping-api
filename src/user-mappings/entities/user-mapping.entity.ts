import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('user_mappings')
@Unique('uk_id1_id2', ['id1', 'id2'])
export class UserMapping {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ type: 'varchar', length: 128 })
  id1: string;

  @Column({ type: 'varchar', length: 128 })
  id2: string;

  @Column({ name: 'user_id', type: 'char', length: 36 })
  userId: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 3 })
  createdAt: Date;
}
