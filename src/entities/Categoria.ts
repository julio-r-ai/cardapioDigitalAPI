import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Restaurante } from "./Restaurante";
import { Produto } from "./Produto";

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

    @ManyToOne(() => Restaurante, restaurante => restaurante.categoria)
    restaurante!: Restaurante;

    @OneToMany(() => Produto, produto => produto.categoria)
    produtos!: Produto[];
}