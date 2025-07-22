import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { Restaurante } from "./Restaurante";
import { ItemPedido } from "./ItemPedido";

@Entity()
export class Pedido {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nomeCompleto!: string;

    @Column()
    whatsapp!: string;

    @Column({ nullable: true })
    observacao!: string;

    @ManyToOne(() => Restaurante)
    restaurante!: Restaurante;

    @CreateDateColumn()
    dataHora!: Date;

    @Column()
    status!: string; 

    /* @OneToMany(() => ItemPedido, item => item.pedido, { cascade: true, onDelete: "CASCADE" }) */
    @OneToMany(() => ItemPedido, item => item.pedido, {
    cascade: ['insert', 'update', 'remove'],   // salvamos itens junto com o pedido
    eager: true            // opcional: sempre carregar itens
    })
    itens!: ItemPedido[];
}