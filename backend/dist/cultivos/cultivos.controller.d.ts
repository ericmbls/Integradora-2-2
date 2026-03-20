import { CultivosService } from './cultivos.service';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';
export declare class CultivosController {
    private readonly cultivosService;
    constructor(cultivosService: CultivosService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(req: any, body: CreateCultivoDto, file?: Express.Multer.File): Promise<any>;
    update(req: any, id: string, file: Express.Multer.File, updateCultivoDto: UpdateCultivoDto): Promise<any>;
    remove(id: string): Promise<{
        id: number;
        createdAt: Date;
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
