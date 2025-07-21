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
        cascade: ['insert', 'update'], // ou só 'insert'
        eager: true // opcional, se quiser que sempre venha com os itens
    })
    itens!: ItemPedido[];
}