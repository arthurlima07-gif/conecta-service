import { PrismaService } from '../../database/prisma.service';
export declare class HealthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    check(): Promise<{
        status: string;
        service: string;
        database: string;
    }>;
}
