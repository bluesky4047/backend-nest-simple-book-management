import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { ResponseUtil } from '../common/utils/response.utils';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // CREATE
  @Post()
  async create(
    @Body('name') name: string,
    @Body('categoryId', ParseIntPipe) categoryId: number,
  ) {
    const data = await this.bookService.create(name, categoryId);
    return ResponseUtil.success('Book created successfully', data);
  }

  // READ ALL
  @Get()
  async findAll() {
    const data = await this.bookService.findAll();
    return ResponseUtil.success('Books retrieved successfully', data);
  }

  // READ ONE
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.bookService.findOne(id);
    return ResponseUtil.success('Book retrieved successfully', data);
  }

  // UPDATE
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
    @Body('categoryId', ParseIntPipe) categoryId: number,
  ) {
    const data = await this.bookService.update(id, name, categoryId);
    return ResponseUtil.success('Book updated successfully', data);
  }

  // DELETE
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.bookService.remove(id);
    return ResponseUtil.success('Book deleted successfully', data);
  }
}
