import { CultivosService } from './cultivos.service';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';
export declare class CultivosController {
    private readonly cultivosService;
    constructor(cultivosService: CultivosService);
    findAll(req: any): Promise<any[]>;
    findOne(id: string, req: any): Promise<any>;
    create(req: any, body: CreateCultivoDto, file?: Express.Multer.File): Promise<any>;
    update(req: any, id: string, file: Express.Multer.File, dto: UpdateCultivoDto): Promise<any>;
    remove(id: string, req: any): Promise<{
        createdAt: Date;
        id: number;
        nombre: string;
        descripcion: string | null;
        fechaSiembra: Date;
        ubicacion: string;
        frecuenciaRiego: number;
        estado: import("@prisma/client").$Enums.EstadoCultivo;
        imagen: string | null;
        userId: number;
    }>;
}
