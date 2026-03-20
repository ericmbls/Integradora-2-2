import { PrismaService } from '../prisma/prisma.service';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';
export declare class CultivosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private formatImage;
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    create(user: any, data: CreateCultivoDto & {
        imagen?: string;
    }): Promise<any>;
    update(id: number, data: UpdateCultivoDto & {
        imagen?: string;
        userId?: number;
    }): Promise<any>;
    remove(id: number): Promise<{
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
