import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Categoria } from "./Categoria";

@Entity()
export class Restaurante {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

    @Column()
    descricao!: string;

    @Column()
    logoUrl!: string;

    @OneToMany(() => Categoria, categoria => categoria.restaurante)
    categorias!: Categoria[];
}