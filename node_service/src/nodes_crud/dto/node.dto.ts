import { NodeModel } from '../models/node.model';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumberString,
  IsDefined,
  ValidateNested,
  IsOptional,
  IsDate,
} from 'class-validator';
export class NodeDto {
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  readonly id: number;

  @ApiProperty({
    description: 'Unix timeStamps saved as bigInt in the database',
    example: '1647675118',
  })
  @IsNotEmpty()
  @IsDefined()
  readonly uptime: bigint;

  @ApiProperty()
  @IsNotEmpty()
  readonly totalRam: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  readonly totalDisk: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  readonly allocDisk: number;
}

export class NodeResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  payload: NodeModel;
}

export class DataDTO {
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  readonly createdAt?: Date;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  readonly uptime?: bigint;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  readonly totalRam?: number;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  readonly totalDisk?: number;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  readonly allocDisk?: number;
}
export class CriteriaDTO extends DataDTO {
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  readonly id?: number;
}

export class UpdateDTO {
  @ApiProperty({
    description:
      'Key Value Pair for the fields you wish to update and their respective values',
    example: '{"totalRam": 5}',
  })
  @IsNotEmpty()
  @IsDefined()
  @ValidateNested()
  @Type(() => DataDTO)
  readonly data: DataDTO;

  @ApiProperty({
    description:
      'Key Value Pair for the "Where" part of the query to be run if empty it runs for all',
    example: '{"uptime": 09300390}',
  })
  @IsNotEmpty()
  @IsDefined()
  @ValidateNested()
  @Type(() => CriteriaDTO)
  readonly criteria: CriteriaDTO;
}

export class FindOneParamsDTO {
  @ApiProperty({
    description: 'id to query with',
  })
  @IsNumberString()
  id: string;
}

export class PaginateDTO {
  @ApiProperty({
    description: 'offset to fetch data for pagination',
  })
  @IsNumberString()
  readonly offset: string;

  @ApiProperty({
    description: 'limit to begin pagination with',
  })
  @IsNumberString()
  readonly limit: string;
}
export class FindDay extends PaginateDTO {
  @ApiProperty({
    description: 'Date String to query data for particular day(yy-mm-dd)',
    example: '2022-03-19',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @IsDefined()
  readonly day: Date;
}
