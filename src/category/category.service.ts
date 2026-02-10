import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // CREATE
  create(category: string) {
    const data = this.categoryRepository.create({ category });
    return this.categoryRepository.save(data);
  }

  // READ ALL
  findAll() {
    return this.categoryRepository.find();
  }

  // READ ONE
  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  // UPDATE
  async update(id: number, category: string) {
    const data = await this.findOne(id);
    data.category = category;
    return this.categoryRepository.save(data);
  }

  // DELETE
  async remove(id: number) {
    const data = await this.findOne(id);
    return this.categoryRepository.remove(data);
  }
}
