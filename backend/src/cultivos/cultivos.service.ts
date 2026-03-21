import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCultivoDto } from './dto/create-cultivo.dto'
import { UpdateCultivoDto } from './dto/update-cultivo.dto'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class CultivosService {
  constructor(private readonly prisma: PrismaService) {}

  private formatImage(cultivo: any) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
    return {
      ...cultivo,
      imagen: cultivo.imagen ? `${baseUrl}${cultivo.imagen}` : null,
    }
  }

  async findAll() {
    const cultivos = await this.prisma.cultivo.findMany({
      include: { user: true, reportes: true },
    })
    return cultivos.map(c => this.formatImage(c))
  }

  async findOne(id: number) {
    const cultivo = await this.prisma.cultivo.findUnique({
      where: { id },
      include: { user: true, reportes: true },
    })

    if (!cultivo) {
      throw new NotFoundException(`Cultivo con id ${id} no encontrado`)
    }

    return this.formatImage(cultivo)
  }

  async create(user: any, data: CreateCultivoDto & { imagen?: string }) {
    if (!user?.id) {
      throw new NotFoundException('Usuario no autenticado')
    }

    const cultivo = await this.prisma.cultivo.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        fechaSiembra: new Date(data.fechaSiembra),
        ubicacion: data.ubicacion,
        frecuenciaRiego: data.frecuenciaRiego,
        estado: data.estado ?? 'activo',
        imagen: data.imagen, 
        user: {
          connect: { id: user.id },
        },
      },
      include: { user: true, reportes: true },
    })

    return this.formatImage(cultivo)
  }

  async update(
    id: number,
    data: UpdateCultivoDto & { imagen?: string; userId?: number },
  ) {
    await this.findOne(id)

    const updateData: any = {}

    if (data.nombre !== undefined) updateData.nombre = data.nombre
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion
    if (data.fechaSiembra !== undefined) updateData.fechaSiembra = new Date(data.fechaSiembra)
    if (data.ubicacion !== undefined) updateData.ubicacion = data.ubicacion
    if (data.frecuenciaRiego !== undefined) updateData.frecuenciaRiego = data.frecuenciaRiego
    if (data.estado !== undefined) updateData.estado = data.estado
    if (data.imagen !== undefined) updateData.imagen = data.imagen 

    const cultivo = await this.prisma.cultivo.update({
      where: { id },
      data: updateData,
      include: { user: true, reportes: true },
    })

    return this.formatImage(cultivo)
  }

  async remove(id: number) {
    const cultivo = await this.findOne(id)

    if (cultivo.imagen) {
      const relativePath = cultivo.imagen.replace(
        process.env.BASE_URL || 'http://localhost:3000',
        '',
      )
      const imagePath = path.join(process.cwd(), relativePath)

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    return this.prisma.cultivo.delete({
      where: { id },
    })
  }
}