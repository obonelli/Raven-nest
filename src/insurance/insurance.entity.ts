import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('insurance')
export class InsuranceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    companyName: string;

    @Column()
    planType: string;

    @Column({ nullable: true })
    coverageArea?: string;

    @Column({ default: true })
    isActive: boolean;
}
