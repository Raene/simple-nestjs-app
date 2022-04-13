import { Test, TestingModule } from '@nestjs/testing';
import { FindOneParamsDTO } from './dto/node.dto';
import { NodesCrudController } from './nodes_crud.controller';
import { NodesCrudService } from './nodes_crud.service';
import { mockNode } from './utils/mocks/variables.service';

const updateValue = 1;

describe('NodesCrudController', () => {
  let controller: NodesCrudController;
  let service: NodesCrudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NodesCrudController],
      providers: [
        {
          provide: NodesCrudService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockNode),
            findOne: jest.fn().mockImplementation((id: number) => {
              return Promise.resolve({ ...mockNode[0], id });
            }),
            create: jest.fn().mockResolvedValue(mockNode[0]),
            update: jest.fn().mockResolvedValue([updateValue]),
            remove: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    service = module.get<NodesCrudService>(NodesCrudService);
    controller = module.get<NodesCrudController>(NodesCrudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all', async () => {
    expect(
      await controller.findAll({ offset: '0', limit: '2' }, { id: 34555 }),
    ).toEqual(mockNode);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should get one', async () => {
    const id: FindOneParamsDTO = {
      id: String(mockNode[0].id),
    };
    expect(await controller.findOne(id)).toEqual(mockNode[0]);
    expect(service.findOne).toHaveBeenCalled();
  });

  it('should create a node log', async () => {
    expect(
      await controller.create({
        ...mockNode[0],
      }),
    ).toEqual(mockNode[0]);
  });

  it('should update a node log/logs based on matches to the where clause', async () => {
    expect(
      await controller.updateStats({
        data: {
          totalRam: 7,
        },
        criteria: {
          totalDisk: 5,
        },
      }),
    ).toEqual(`${updateValue} records were updated`);
    expect(service.update).toHaveBeenCalled();
  });

  it('should delete a node log/logs based on matches to the where clause', async () => {
    expect(
      await controller.deleteStats({
        totalDisk: 5,
      }),
    ).toEqual('1 records were deleted');
    expect(service.remove).toHaveBeenCalled();
  });
});
