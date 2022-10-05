import {getPrismaClient} from '../src/services/utils/prisma';
import {seedAccountTypes} from './seed-account-types';

const prisma = getPrismaClient();

const seed = async (): Promise<void> => {
    await seedAccountTypes(prisma, true);
};

seed()
    .finally(() => {
        prisma.$disconnect();
    });
