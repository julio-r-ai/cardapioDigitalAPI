import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Produto } from "./Produto";
import { Pedido } from "./Pedido";

@Entity()
export class ItemPedido {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Produto, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "produtoId" })
    produto!: Produto;

    /* @ManyToOne(() => Pedido, pedido => pedido.itens, { onDelete: "CASCADE" })
    pedido!: Pedido; */
    @ManyToOne(() => Pedido, pedido => pedido.itens, {
    onDelete: "CASCADE",
    nullable: false
    })
    @JoinColumn({ name: "pedidoId" })
    pedido!: Pedido;
    
    @Column()
    quantidade!: number;
}