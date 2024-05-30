import { Test, TestingModule } from '@nestjs/testing';
import { ElasticsearchService } from './elasticsearch.service';
import { Client } from '@elastic/elasticsearch';

jest.mock('@elastic/elasticsearch', () => {
  const mClient = {
    cluster: {
      health: jest.fn(),
    },
  };
  return { Client: jest.fn(() => mClient) };
});

describe('ElasticsearchService', () => {
  let service: ElasticsearchService;
  let clientMock: jest.Mocked<Client>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElasticsearchService],
    }).compile();

    service = module.get<ElasticsearchService>(ElasticsearchService);
    clientMock = service.getClient() as jest.Mocked<Client>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should log health status if Elasticsearch is available', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      (clientMock.cluster.health as jest.Mock).mockResolvedValueOnce({
        status: 'green',
      });

      await service.onModuleInit();

      expect(clientMock.cluster.health).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith('elasticsearch health: ', {
        status: 'green',
      });

      consoleLogSpy.mockRestore();
    });

    it('should log an error if Elasticsearch is not available', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Elasticsearch cluster is not available');
      (clientMock.cluster.health as jest.Mock).mockRejectedValueOnce(error);

      await service.onModuleInit();

      expect(clientMock.cluster.health).toHaveBeenCalledTimes(2);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Elasticsearch cluster is not available:',
        error,
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
