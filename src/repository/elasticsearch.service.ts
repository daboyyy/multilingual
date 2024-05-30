import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService implements OnModuleInit, OnModuleDestroy {
  private readonly client: Client;

  constructor() {
    this.client = new Client({ node: 'http://localhost:9200' });
  }

  async onModuleInit() {
    try {
      const health = await this.client.cluster.health({});
      console.log('elasticsearch health: ', health);
    } catch (error) {
      console.error('Elasticsearch cluster is not available:', error);
    }
  }

  async onModuleDestroy() {}

  getClient() {
    return this.client;
  }
}
