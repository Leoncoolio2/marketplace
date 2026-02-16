export class CreateProductDto {
  title!: string;
  description!: string;
  price!: number;
  sellerId!: string;
  isPreorder?: boolean;
  availableAt?: string;
}
