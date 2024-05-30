import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateProductTranslationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  languageCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
