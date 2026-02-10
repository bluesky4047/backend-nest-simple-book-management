import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from '../book/book.entity';

@Entity()
export class Category {
  static remove(data: void) {
    throw new Error('Method not implemented.');
  }
  static findOne(arg0: { where: { id: number } }) {
    throw new Error('Method not implemented.');
  }
  static find() {
    throw new Error('Method not implemented.');
  }
  static save(data: void) {
    throw new Error('Method not implemented.');
  }
  static create(arg0: { category: string }) {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
