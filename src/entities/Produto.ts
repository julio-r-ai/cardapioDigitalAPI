import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Categoria } from "./Categoria";

@Entity()
export class Produto {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

    @Column()
    descricao!: string;

    @Column("decimal", { precision: 10, scale: 2 })
    preco!: number;

    @ManyToOne(() => Categoria, categoria => categoria.produtos)
    categoria!: Categoria;
}