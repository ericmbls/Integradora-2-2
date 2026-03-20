"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CultivosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let CultivosService = class CultivosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    formatImage(cultivo) {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        return {
            ...cultivo,
            imagen: cultivo.imagen ? `${baseUrl}${cultivo.imagen}` : null,
        };
    }
    async findAll() {
        const cultivos = await this.prisma.cultivo.findMany({
            include: { user: true, reportes: true },
        });
        return cultivos.map(c => this.formatImage(c));
    }
    async findOne(id) {
        const cultivo = await this.prisma.cultivo.findUnique({
            where: { id },
            include: { user: true, reportes: true },
        });
        if (!cultivo) {
            throw new common_1.NotFoundException(`Cultivo con id ${id} no encontrado`);
        }
        return this.formatImage(cultivo);
    }
    async create(user, data) {
        if (!user?.id) {
            throw new common_1.NotFoundException('Usuario no autenticado');
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
        });
        return this.formatImage(cultivo);
    }
    async update(id, data) {
        await this.findOne(id);
        const updateData = {};
        if (data.nombre !== undefined)
            updateData.nombre = data.nombre;
        if (data.descripcion !== undefined)
            updateData.descripcion = data.descripcion;
        if (data.fechaSiembra !== undefined)
            updateData.fechaSiembra = new Date(data.fechaSiembra);
        if (data.ubicacion !== undefined)
            updateData.ubicacion = data.ubicacion;
        if (data.frecuenciaRiego !== undefined)
            updateData.frecuenciaRiego = data.frecuenciaRiego;
        if (data.estado !== undefined)
            updateData.estado = data.estado;
        if (data.imagen !== undefined)
            updateData.imagen = data.imagen;
        const cultivo = await this.prisma.cultivo.update({
            where: { id },
            data: updateData,
            include: { user: true, reportes: true },
        });
        return this.formatImage(cultivo);
    }
    async remove(id) {
        const cultivo = await this.findOne(id);
        if (cultivo.imagen) {
            const relativePath = cultivo.imagen.replace(process.env.BASE_URL || 'http://localhost:3000', '');
            const imagePath = path.join(process.cwd(), relativePath);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        return this.prisma.cultivo.delete({
            where: { id },
        });
    }
};
exports.CultivosService = CultivosService;
exports.CultivosService = CultivosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CultivosService);
//# sourceMappingURL=cultivos.service.js.map