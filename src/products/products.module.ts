import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { PrismaService } from 'src/repository/prisma.service';
import { ElasticsearchService } from 'src/repository/elasticsearch.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, ElasticsearchService],
})
export class ProductsModule {}
