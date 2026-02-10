import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  // CREATE
  async create(name: string, category: number): Promise<Book> {
    const book = this.bookRepository.create({
      name,
      category: { id: category },
    });
    return this.bookRepository.save(book);
  }

  // READ ALL
  findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  // READ ONE
  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async update(id: number, name: string, categoryId: number): Promise<Book> {
    const book = await this.bookRepository.preload({
      id,
      name,
      category: { id: categoryId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return this.bookRepository.save(book);
  }

  // DELETE
  async remove(id: number): Promise<Book> {
    const book = await this.findOne(id);
    return this.bookRepository.remove(book);
  }
}
