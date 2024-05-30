import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/repository/prisma.service';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ElasticsearchService } from 'src/repository/elasticsearch.service';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';

type MockedSearchResponse = SearchResponse<
  { productId: string; name: string },
  any
>;

describe('ProductService', () => {
  let productService: ProductService;
  let prismaService: PrismaService;
  let elasticsearchService: ElasticsearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, PrismaService, ElasticsearchService],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    prismaService = module.get<PrismaService>(PrismaService);
    elasticsearchService =
      module.get<ElasticsearchService>(ElasticsearchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  describe('createProduct', () => {
    // it('should create a product', async () => {
    //   const createProductDto: CreateProductDto = {
    //     translations: [
    //       {
    //         name: 'Test Product English',
    //         description: 'Description for Test Product in English',
    //         languageCode: 'en',
    //       },
    //       {
    //         name: 'Test Product French',
    //         description: 'Description for Test Product in French',
    //         languageCode: 'fr',
    //       },
    //     ],
    //   };

    //   const currentTime = new Date();

    //   jest.spyOn(prismaService.product, 'create').mockResolvedValueOnce({
    //     id: '4acc4979-9210-49cf-b496-93552bde0228',
    //     created_at: currentTime,
    //     updated_at: currentTime,
    //   });

    //   jest.spyOn(elasticsearchService.getClient(), 'index');

    //   // Call the method that you want to test
    //   const result = await productService.createProduct(createProductDto);

    //   // Assertions
    //   expect(result.id).toEqual('4acc4979-9210-49cf-b496-93552bde0228');
    //   expect(result.created_at).toEqual(currentTime);
    //   expect(result.updated_at).toEqual(currentTime);
    // });

    it('should throw error if indexing fails', async () => {
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

      jest.spyOn(prismaService.product, 'create').mockResolvedValueOnce({
        id: 'testProductId',
        created_at: new Date(),
        updated_at: new Date(),
      });

      jest
        .spyOn(elasticsearchService.getClient(), 'index')
        .mockRejectedValueOnce(new Error('Failed to index product'));

      await expect(
        productService.createProduct(createProductDto),
      ).rejects.toThrowError('Failed to index product');
    });
  });

  describe('searchProducts', () => {
    it('should search products', async () => {
      const query = 'testQuery';
      const page = 1;
      const limit = 10;

      const mockSearchResponse: MockedSearchResponse = {
        took: 10,
        timed_out: false,
        _shards: {
          total: 5,
          successful: 5,
          skipped: 0,
          failed: 0,
        },
        hits: {
          total: {
            value: 1,
            relation: 'eq',
          },
          max_score: 1,
          hits: [
            {
              _index: 'products',
              _id: '1',
              _score: 1,
              _source: {
                productId: 'testProductId',
                name: 'Test Product',
              },
            },
          ],
        },
      };

      jest
        .spyOn(elasticsearchService.getClient(), 'search')
        .mockResolvedValueOnce(mockSearchResponse);

      const result = await productService.searchProducts(query, page, limit);

      expect(result.meta.total).toEqual(1);
      expect(result.results.length).toEqual(1);
      expect(result.results[0].productId).toEqual('testProductId');
    });
  });
});
