import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePreferencesDto } from '../auth/dto/update-preferences.dto';
export declare class UsuariosService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        language: string | null;
        farmName: string | null;
        location: string | null;
        id: number;
    }[]>;
    findOne(id: number): Promise<{
        name: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        darkMode: boolean;
        language: string | null;
        farmName: string | null;
        location: string | null;
        id: number;
    }>;
    create(dto: CreateUserDto): Promise<{
        name: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        darkMode: boolean;
        language: string | null;
        farmName: string | null;
        location: string | null;
        id: number;
    }>;
    update(id: number, dto: UpdateUserDto): Promise<{
        name: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        darkMode: boolean;
        language: string | null;
        farmName: string | null;
        location: string | null;
        id: number;
    }>;
    remove(id: number): Promise<{
        name: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        darkMode: boolean;
        language: string | null;
        farmName: string | null;
        location: string | null;
        id: number;
    }>;
    updatePreferences(userId: number, dto: UpdatePreferencesDto): Promise<{
        darkMode: boolean;
        language: string | null;
        farmName: string | null;
        location: string | null;
    }>;
    getPreferences(userId: number): Promise<{
        darkMode: boolean;
        language: string | null;
        farmName: string | null;
        location: string | null;
    }>;
}
