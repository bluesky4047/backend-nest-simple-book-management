import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ResponseUtil } from '../common/utils/response.utils';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body('category') category: string) {
    const data = await this.categoryService.create(category);

    return ResponseUtil.success('Category created successfully', data);
  }

  @Get()
  async findAll() {
    const data = await this.categoryService.findAll();
    return ResponseUtil.success('Categories retrieved successfully', data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.categoryService.findOne(id);
    return ResponseUtil.success('Category retrieved successfully', data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('category') category: string,
  ) {
    const data = await this.categoryService.update(id, category);
    return ResponseUtil.success('Category updated successfully', data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.categoryService.remove(id);
    return ResponseUtil.success('Category deleted successfully', data);
  }
}
