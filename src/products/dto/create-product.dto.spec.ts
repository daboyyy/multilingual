import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProductDto } from './create-product.dto';
import { CreateProductTranslationDto } from './create-product-translation.dto';

describe('CreateProductDto', () => {
  it('should validate with valid data', async () => {
    const dtoData = {
      translations: [
        {
          name: 'Test Product English',
          description: 'Description for Test Product in English',
          languageCode: 'en',
        },
        {
          name: 'Test Product French',
          description: 'Description for Test Product in French',
          languageCode: 'fr',
        },
      ],
    };

    const dto = plainToClass(CreateProductDto, dtoData);
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should throw validation error if translations is not an array', async () => {
    const dtoData = {
      translations: 'not an array',
    };

    const dto = plainToClass(CreateProductDto, dtoData);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isArray');
  });

  it('should throw validation error if translations array is empty', async () => {
    const dtoData = {
      translations: [],
    };

    const dto = plainToClass(CreateProductDto, dtoData);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('arrayNotEmpty');
  });

  it('should throw validation error if translations contain invalid data', async () => {
    const dtoData = {
      translations: [
        new CreateProductTranslationDto(),
        {} as CreateProductTranslationDto,
      ],
    };

    const dto = plainToClass(CreateProductDto, dtoData);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
  });
});
