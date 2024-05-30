import { Module } from '@nestjs/common';
import { PrismaService } from './repository/prisma.service';
import { ProductsModule } from './products/products.module';
import { ElasticsearchService } from './repository/elasticsearch.service';

@Module({
  imports: [ProductsModule],
  providers: [PrismaService, ElasticsearchService],
})
export class AppModule {}
