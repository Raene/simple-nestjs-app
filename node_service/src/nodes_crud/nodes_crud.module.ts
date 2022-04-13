import { Module } from '@nestjs/common';
import { NodesCrudService } from './nodes_crud.service';
import { NodesCrudController } from './nodes_crud.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { NodeModel } from './models/node.model';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([NodeModel]),
    PassportModule,
    JwtModule.registerAsync({
      //async JWTModule so we can inject dependencies e.g configService
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string | number>('JWT_TTL'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [NodesCrudService, JwtStrategy],
  controllers: [NodesCrudController],
})
export class NodesCrudModule {}
