import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Produto } from "./Produto";
import { Pedido } from "./Pedido";

@Entity()
export class ItemPedido {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Produto)
    produto!: Produto;

    @ManyToOne(() => Pedido, pedido => pedido.itens)
    pedido!: Pedido;

    @Column()
    quantidade!: number;
}