import { PrismaService } from '../prisma/prisma.service';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';
export declare class CultivosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private formatImage;
    findAll(userId: number): Promise<any[]>;
    findOne(id: number, userId: number): Promise<any>;
    create(user: any, data: CreateCultivoDto & {
        imagen?: string;
    }): Promise<any>;
    update(id: number, userId: number, data: UpdateCultivoDto & {
        imagen?: string;
    }): Promise<any>;
    remove(id: number, userId: number): Promise<{
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
