import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ElasticsearchService } from 'src/repository/elasticsearch.service';
import { SearchMetadata, SearchResult } from 'src/types';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ProductService {
  private readonly elasticSearchClient: Client;

  constructor(
    private prisma: PrismaService,
    private elasticsearchService: ElasticsearchService,
  ) {
    this.elasticSearchClient = this.elasticsearchService.getClient();
  }

  async createProduct(data: CreateProductDto) {
    return await this.prisma.$transaction(async (prismaTxn) => {
      const product = await prismaTxn.product.create({
        data: {
          translations: {
            createMany: {
              data: data.translations.map((translation) => ({
                name: translation.name,
                description: translation.description,
                language_code: translation.languageCode,
              })),
            },
          },
        },
        include: {
          translations: true,
        },
      });

      try {
        await this.elasticSearchClient.index({
          index: 'products',
          id: product.id,
          body: {
            translations: product.translations,
          },
        });
      } catch (error) {
        throw new Error('Failed to index product in Elasticsearch');
      }

      return product;
    });
  }

  async searchProducts(
    query: string,
    page: number,
    limit: number,
  ): Promise<SearchResult> {
    const response = await this.elasticsearchService.getClient().search({
      index: 'products',
      from: (page - 1) * limit,
      size: limit,
      body: {
        query: {
          multi_match: {
            query,
            fields: ['translations.name', 'translations.description'],
          },
        },
      },
    });

    const searchResults = response.hits.hits.map((hit: any) => hit._source);

    let totalHits: number;

    if (typeof response.hits.total === 'object') {
      totalHits = response.hits.total.value as number;
    } else {
      totalHits = response.hits.total as number;
    }

    const searchMeta: SearchMetadata = {
      total: totalHits,
      page,
      limit,
      pages: Math.ceil(totalHits / limit),
    };

    return { results: searchResults, meta: searchMeta };
  }
}
