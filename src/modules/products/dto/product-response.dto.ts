import { CategoryResponseDto } from '../../categories/dto/category-response.dto';

export class ProductResponseDto {
  id!: number;

  name!: string;

  description?: string;

  price!: number;

  categoryId!: number;

  category?: CategoryResponseDto;

  userId!: number;

  createdAt?: string;

  updatedAt?: string;
}
