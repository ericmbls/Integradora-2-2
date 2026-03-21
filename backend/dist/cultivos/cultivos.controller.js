"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CultivosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const cultivos_service_1 = require("./cultivos.service");
const create_cultivo_dto_1 = require("./dto/create-cultivo.dto");
const update_cultivo_dto_1 = require("./dto/update-cultivo.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const storage = (0, multer_1.diskStorage)({
    destination: './uploads',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + (0, path_1.extname)(file.originalname));
    },
});
let CultivosController = class CultivosController {
    cultivosService;
    constructor(cultivosService) {
        this.cultivosService = cultivosService;
    }
    findAll(req) {
        return this.cultivosService.findAll(req.user.id);
    }
    findOne(id, req) {
        return this.cultivosService.findOne(Number(id), req.user.id);
    }
    create(req, body, file) {
        if (file) {
            body.imagen = `/uploads/${file.filename}`;
        }
        return this.cultivosService.create(req.user, body);
    }
    update(req, id, file, dto) {
        return this.cultivosService.update(Number(id), req.user.id, {
            ...dto,
            imagen: file ? `/uploads/${file.filename}` : dto.imagen,
        });
    }
    remove(id, req) {
        return this.cultivosService.remove(Number(id), req.user.id);
    }
};
exports.CultivosController = CultivosController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CultivosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CultivosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen', { storage })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_cultivo_dto_1.CreateCultivoDto, Object]),
    __metadata("design:returntype", void 0)
], CultivosController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen', { storage })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, update_cultivo_dto_1.UpdateCultivoDto]),
    __metadata("design:returntype", void 0)
], CultivosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CultivosController.prototype, "remove", null);
exports.CultivosController = CultivosController = __decorate([
    (0, common_1.Controller)('cultivos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [cultivos_service_1.CultivosService])
], CultivosController);
//# sourceMappingURL=cultivos.controller.js.map