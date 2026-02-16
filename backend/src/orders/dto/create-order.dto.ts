import { IsUUID, IsInt, Min } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  buyerId!: string;

  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}
