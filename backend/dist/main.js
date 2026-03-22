"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        stopAtFirstError: true,
    }));
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: process.env.FRONTEND_URL || '*',
        credentials: true,
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map