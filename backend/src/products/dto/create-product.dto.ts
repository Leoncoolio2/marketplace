import { IsString, IsNumber, IsOptional, IsBoolean, IsUUID, IsPositive, IsDateString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsUUID()
  sellerId!: string;

  @IsOptional()
  @IsBoolean()
  isPreorder?: boolean;

  @IsOptional()
  @IsDateString()
  availableAt?: string;
}
