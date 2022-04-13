import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NodeModel } from './models/node.model';
import { CriteriaDTO, NodeDto, UpdateDTO } from './dto/node.dto';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class NodesCrudService {
  constructor(
    @InjectModel(NodeModel)
    private nodeModel: typeof NodeModel,
  ) {}

  async create(node: NodeDto): Promise<NodeModel> {
    const n = await this.nodeModel.create<NodeModel>(node);
    return n;
  }

  async findAll(
    offset: number,
    limit: number,
    criteria: CriteriaDTO,
  ): Promise<NodeModel[]> {
    return await this.nodeModel.findAll({
      where: { ...criteria },
      offset,
      limit,
    });
  }

  async findOne(id: number): Promise<NodeModel> {
    return await this.nodeModel.findOne<NodeModel>({
      where: {
        id,
      },
    });
  }

  async remove(criteria: CriteriaDTO): Promise<number> {
    const node = await this.nodeModel.destroy({
      where: { ...criteria },
    });

    return node;
  }

  async update(payload: UpdateDTO): Promise<number[]> {
    const update = await this.nodeModel.update(payload.data, {
      where: { ...payload.criteria },
    });
    return update;
  }

  async findAllToday(
    day: Date,
    offset: number,
    limit: number,
    criteria: CriteriaDTO,
  ): Promise<NodeModel[]> {
    const startTime = new Date(day);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(day);
    endTime.setDate(endTime.getDate() + 1);
    return await this.nodeModel.findAll({
      where: {
        createdAt: {
          [Op.gt]: startTime,
          [Op.lt]: endTime,
        },
        ...criteria,
      },
      offset,
      limit,
      attributes: {
        include: [
          [
            Sequelize.fn('date_trunc', 'hour', Sequelize.col('createdAt')),
            'hour',
          ],
          [Sequelize.fn('count', '*'), 'count'],
        ],
      },
      group: [
        'createdAt',
        'id',
        'uptime',
        'totalRam',
        'totalDisk',
        'allocDisk',
      ],
    });
  }
}
