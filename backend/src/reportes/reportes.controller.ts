import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";

import { FileInterceptor } from "@nestjs/platform-express";

import { ReportesService } from "./reportes.service";
import { CreateReporteDto } from "./dto/create-reporte.dto";
import { UpdateReporteDto } from "./dto/update-reporte.dto";

@Controller("reportes")
export class ReportesController {

  constructor(private readonly reportesService: ReportesService) {}

  @Post()
  @UseInterceptors(FileInterceptor("imagen"))
  async create(
    @Body() dto: CreateReporteDto,
    @UploadedFile() file?: Express.Multer.File
  ) {

   const imagen = file ? `/uploads/${file.filename}` : undefined;

return this.reportesService.create(dto, imagen);
  }

  @Get("cultivo/:id")
  findByCultivo(
    @Param("id", ParseIntPipe) cultivoId: number
  ) {

    return this.reportesService.findByCultivo(cultivoId);

  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateReporteDto
  ) {

    return this.reportesService.update(id, dto);

  }

  @Delete(":id")
  remove(
    @Param("id", ParseIntPipe) id: number
  ) {

    return this.reportesService.remove(id);

  }

}