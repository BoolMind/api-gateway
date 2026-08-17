import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { PaginationQueryDto } from '@common/dto';

import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { CategoriesService } from '../services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  // Must come before ':id' — otherwise 'all' is captured as the :id param.
  @Get('all')
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getById(id);
  }

  @Get()
  paginate(@Query() query: PaginationQueryDto) {
    return this.categoriesService.paginate(query);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.delete(id);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.restore(id);
  }
}
