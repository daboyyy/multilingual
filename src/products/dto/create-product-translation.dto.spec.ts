import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProductTranslationDto } from './create-product-translation.dto';

describe('CreateProductTranslationDto', () => {
  it('should validate with valid data', async () => {
    const dtoData = {
      languageCode: 'en',
      name: 'Valid Name',
      description: 'This is a valid description.',
    };

    const dto = plainToClass(CreateProductTranslationDto, dtoData);
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should throw validation error if languageCode is not a string', async () => {
    const dtoData = {
      languageCode: 123,
      name: 'Valid Name',
      description: 'This is a valid description.',
    };

    const dto = plainToClass(CreateProductTranslationDto, dtoData);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should throw validation error if languageCode is empty', async () => {
    const dtoData = {
      languageCode: '',
      name: 'Valid Name',
      description: 'This is a valid description.',
    };

    const dto = plainToClass(CreateProductTranslationDto, dtoData);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should throw validation error if languageCode exceeds max length', async () => {
    const dtoData = {
      languageCode: 'abcdef',
      name: 'Valid Name',
      description: 'This is a valid description.',
    };

    const dto = plainToClass(CreateProductTranslationDto, dtoData);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });

  it('should throw validation error if name is not a string', async () => {
    const dtoData = {
      languageCode: 'en',
      name: 123,
      description: 'This is a valid description.',
    };

    const dto = plainToClass(CreateProductTranslationDto, dtoData);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should throw validation error if name is empty', async () => {
    const dtoData = {
      languageCode: 'en',
      name: '',
      description: 'This is a valid description.',
    };

    const dto = plainToClass(CreateProductTranslationDto, dtoData);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should throw validation error if name exceeds max length', async () => {
    const dtoData = {
      languageCode: 'en',
      name: 'a'.repeat(256),
      description: 'This is a valid description.',
    };

    const dto = plainToClass(CreateProductTranslationDto, dtoData);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });

  it('should throw validation error if description is not a string', async () => {
    const dtoData = {
      languageCode: 'en',
      name: 'Valid Name',
      description: 123,
    };

    const dto = plainToClass(CreateProductTranslationDto, dtoData);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should throw validation error if description is empty', async () => {
    const dtoData = {
      languageCode: 'en',
      name: 'Valid Name',
      description: '',
    };

    const dto = plainToClass(CreateProductTranslationDto, dtoData);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });
});
