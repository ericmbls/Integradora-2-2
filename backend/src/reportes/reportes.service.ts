import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

import { CreateReporteDto } from "./dto/create-reporte.dto";
import { UpdateReporteDto } from "./dto/update-reporte.dto";

@Injectable()
export class ReportesService {

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReporteDto, imagen?: string) {

    return this.prisma.reporte.create({
      data: {
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        tipo: dto.tipo,
        cultivoId: dto.cultivoId,
        imagen: imagen ?? null
      }
    });

  }

  async findByCultivo(cultivoId: number) {

    return this.prisma.reporte.findMany({
      where: {
        cultivoId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

  }

  async update(id: number, dto: UpdateReporteDto) {

    return this.prisma.reporte.update({
      where: { id },
      data: dto
    });

  }

  async remove(id: number) {

    return this.prisma.reporte.delete({
      where: { id }
    });

  }

}