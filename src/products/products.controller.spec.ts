import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './products.controller';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchResult } from 'src/types';
import { PrismaService } from 'src/repository/prisma.service';
import { ElasticsearchService } from 'src/repository/elasticsearch.service';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService, PrismaService, ElasticsearchService],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
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

      const mockResult = {
        id: 'someProductId',
        created_at: new Date(),
        updated_at: new Date(),
        translations: [
          {
            id: 1,
            product_id: 'someProductId',
            language_code: 'en',
            name: 'Product Name',
            description: 'Product Description',
          },
        ],
      };

      jest
        .spyOn(productService, 'createProduct')
        .mockResolvedValueOnce(mockResult);

      const result = await controller.createProduct(createProductDto);

      expect(result).toEqual(mockResult);
    });
  });

  describe('searchProducts', () => {
    it('should search products', async () => {
      const query = 'testQuery';
      const page = 1;
      const limit = 10;

      const mockSearchResult: SearchResult = {
        results: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          pages: 2,
        },
      };

      jest
        .spyOn(productService, 'searchProducts')
        .mockResolvedValueOnce(mockSearchResult);

      const result = await controller.searchProducts(query, page, limit);

      expect(result).toEqual(mockSearchResult);
    });
  });
});
