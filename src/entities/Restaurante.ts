import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Categoria } from "./Categoria";
import { Usuario } from "./Usuario";

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

    @ManyToOne(() => Usuario, { eager: true })
    usuario!: Usuario;

    @OneToMany(() => Categoria, categoria => categoria.restaurante)
    categorias!: Categoria[];
}