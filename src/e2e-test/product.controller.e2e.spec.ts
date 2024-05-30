import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { PrismaService } from '../repository/prisma.service';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await prismaService.$connect();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  describe('/products (POST)', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        translations: [
          {
            name: 'Test Product English',
            description: 'Description for Test Product in English',
            languageCode: 'en',
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(201);

      expect(response.body).toEqual({
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        translations: [
          {
            id: expect.any(Number),
            language_code: 'en',
            name: 'Test Product English',
            description: 'Description for Test Product in English',
            product_id: expect.any(String),
          },
        ],
      });
    });

    it('should return a validation error if translations array is empty', async () => {
      const createProductDto = {
        translations: [],
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(400);

      expect(response.body.message[0]).toContain(
        'translations should not be empty',
      );
    });
  });

  describe('/products/search (GET)', () => {
    it('should search products with default pagination', async () => {
      const query = 'Test Product';

      const response = await request(app.getHttpServer())
        .get('/products/search')
        .query({ query })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          meta: expect.objectContaining({
            limit: 10,
            page: 1,
          }),
          results: expect.any(Array),
        }),
      );
    });

    it('should search products with specified pagination', async () => {
      const query = 'Test Product';
      const page = 2;
      const limit = 5;

      const response = await request(app.getHttpServer())
        .get('/products/search')
        .query({ query, page, limit })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          meta: expect.objectContaining({
            limit,
            page,
          }),
          results: expect.any(Array),
        }),
      );
    });
  });
});
