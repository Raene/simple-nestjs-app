import { Test, TestingModule } from '@nestjs/testing';
import { NodesCrudService } from './nodes_crud.service';
import { NodeModel } from './models/node.model';
import { getModelToken } from '@nestjs/sequelize';
import { mockNode } from './utils/mocks/variables.service';

describe('NodesCrudService', () => {
  let service: NodesCrudService;
  let model: typeof NodeModel;
  const criteria = {
    totalDisk: 5,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NodesCrudService,
        {
          provide: getModelToken(NodeModel),
          useValue: {
            findAll: jest.fn(() => mockNode),
            findOne: jest.fn(),
            create: jest.fn(() => mockNode[0]),
            destroy: jest.fn(),
            update: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    service = module.get<NodesCrudService>(NodesCrudService);
    model = module.get<typeof NodeModel>(getModelToken(NodeModel));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all node logs', async () => {
    expect(await service.findAll(0, 2, criteria)).toEqual(mockNode);
  });

  it('should add a node log', async () => {
    expect(
      await service.create({
        ...mockNode[0],
      }),
    ).toEqual(mockNode[0]);
  });

  it('should get a single node log', async () => {
    const findSpy = jest.spyOn(model, 'findOne');
    expect(await service.findOne(1));
    expect(findSpy).toBeCalledWith({ where: { id: 1 } });
  });

  it('should update node log/logs based on criteria', async () => {
    const updateSpy = jest.spyOn(model, 'update');
    expect(
      await service.update({
        data: {
          totalRam: 7,
        },
        criteria,
      }),
    );
    expect(updateSpy).toBeCalledTimes(1);
  });

  it('should delete node log/logd based on criteria', async () => {
    const destroySpy = jest.spyOn(model, 'destroy');
    await service.remove(criteria);
    expect(destroySpy).toBeCalledTimes(1);
  });
});
