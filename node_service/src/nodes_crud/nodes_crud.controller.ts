import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Request,
  UseInterceptors,
  UseFilters,
  BadRequestException,
  Delete,
  Put,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { NodesCrudService } from './nodes_crud.service';
import {
  CriteriaDTO,
  FindDay,
  FindOneParamsDTO,
  NodeDto,
  NodeResponseDto,
  PaginateDTO,
  UpdateDTO,
} from './dto/node.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TransformInterceptor } from './transformers/transform.interceptor';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@UseFilters(HttpExceptionFilter)
@UseInterceptors(TransformInterceptor)
@Controller('nodes-crud')
export class NodesCrudController {
  constructor(private nodeCrudService: NodesCrudService) {}

  @Post(':offset/:limit')
  @ApiResponse({
    status: 200,
    description: 'Node logs have been successfully fetched',
    type: NodeResponseDto,
  })
  async findAll(
    @Param() { limit, offset }: PaginateDTO,
    @Body() criteria: CriteriaDTO,
  ) {
    const payload = await this.nodeCrudService
      .findAll(Number(offset), Number(limit), criteria)
      .catch((err) => {
        console.error(err);
        if (err.errors[0].message) {
          throw new ForbiddenException(err.errors[0].message);
        }
        throw new BadRequestException('something went wrong');
      });
    return payload;
  }

  @Post('today/:day/:offset/:limit')
  @ApiResponse({
    status: 200,
    description: 'Node logs for specified day has been successfully fetched',
    type: NodeResponseDto,
  })
  async findAllToday(
    @Param() { day, offset, limit }: FindDay,
    @Body() criteria: CriteriaDTO,
  ) {
    const payload = await this.nodeCrudService
      .findAllToday(day, Number(offset), Number(limit), criteria)
      .catch((err) => {
        console.error(err);
        if (err.errors[0].message) {
          throw new ForbiddenException(err.errors[0].message);
        }
        throw new BadRequestException('something went wrong');
      });

    const byHour = {};

    await payload.map((data) => {
      const d = new Date(data.getDataValue('hour'));
      const hour = d.getHours();
      if (byHour[hour]) {
        byHour[hour].push(data);
      } else {
        byHour[hour] = [];
        byHour[hour].push(data);
      }
    });
    return byHour;
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'A Node log has been successfully fetched',
    type: NodeResponseDto,
  })
  async findOne(@Param() { id }: FindOneParamsDTO) {
    const payload = await this.nodeCrudService
      .findOne(Number(id))
      .catch((err) => {
        console.error(err);
        if (err.errors[0].message) {
          throw new ForbiddenException(err.errors[0].message);
        }
        throw new BadRequestException('something went wrong');
      });
    return payload;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'A Node log has been successfully created',
    type: NodeResponseDto,
  })
  async create(@Body() node: NodeDto) {
    const payload = await this.nodeCrudService.create(node).catch((err) => {
      console.error(err);
      if (err.errors[0].message) {
        throw new ForbiddenException(err.errors[0].message);
      }
      throw new BadRequestException('something went wrong');
    });
    return payload;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiResponse({
    status: 200,
    description: 'Node logs has been successfully deleted',
    type: NodeResponseDto,
  })
  async deleteStats(@Body() criteria: CriteriaDTO) {
    const payload = await this.nodeCrudService.remove(criteria).catch((err) => {
      console.error(err);
      if (err.errors[0].message) {
        throw new ForbiddenException(err.errors[0].message);
      }
      throw new BadRequestException('something went wrong');
    });
    const str = `${payload} records were deleted`;

    return str;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiResponse({
    status: 200,
    description: 'Node logs matching a criteria have been updated',
    type: NodeResponseDto,
  })
  async updateStats(@Body() update: UpdateDTO) {
    const payload = await this.nodeCrudService.update(update).catch((err) => {
      console.error(err);
      if (err.errors[0].message) {
        throw new ForbiddenException(err.errors[0].message);
      }
      throw new BadRequestException('something went wrong');
    });
    return `${payload[0]} records were updated`;
  }
}
