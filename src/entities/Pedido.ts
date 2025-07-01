import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { Restaurante } from "./Restaurante";
import { ItemPedido } from "./ItemPedido";

@Entity()
export class Pedido {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Restaurante)
    restaurante!: Restaurante;

    @CreateDateColumn()
    dataHora!: Date;

    @Column()
    status!: string;  // Ex: "Pendente", "Preparando", "Finalizado"

    @OneToMany(() => ItemPedido, item => item.pedido, { cascade: true })
    itens!: ItemPedido[];
}