import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    senha!: string;

    @Column()
    nome!: string;
    
    @Column({ type: "varchar", length: 255, nullable: true })
    resetToken!: string | null;

    @Column({ type: "datetime", nullable: true })
    resetTokenExpira!: Date | null;
}