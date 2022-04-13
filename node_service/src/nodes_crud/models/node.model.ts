import { Column, Model, Table, DataType } from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({
  tableName: 'node_stats',
})
export class NodeModel extends Model<
  InferAttributes<NodeModel>,
  InferCreationAttributes<NodeModel>
> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  uptime: bigint;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  totalRam: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  totalDisk: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  allocDisk: number;

  hour?: string;
}
