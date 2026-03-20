import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { CultivosService } from './cultivos.service'
import { CreateCultivoDto } from './dto/create-cultivo.dto'
import { UpdateCultivoDto } from './dto/update-cultivo.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Role } from '../auth/role.decorator'

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + extname(file.originalname))
  },
})

@Controller('cultivos')
export class CultivosController {
  constructor(private readonly cultivosService: CultivosService) {}

  @Get()
  findAll() {
    return this.cultivosService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cultivosService.findOne(Number(id))
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('imagen', { storage }))
  create(
    @Request() req,
    @Body() body: CreateCultivoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      body.imagen = `/uploads/${file.filename}`
    }
    return this.cultivosService.create(req.user, body)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('imagen', { storage }))
  update(
    @Request() req,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateCultivoDto: UpdateCultivoDto,
  ) {
    return this.cultivosService.update(Number(id), {
      ...updateCultivoDto,
      imagen: file ? `/uploads/${file.filename}` : updateCultivoDto.imagen,
      userId: req.user.sub,
    })
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  remove(@Param('id') id: string) {
    return this.cultivosService.remove(Number(id))
  }
}