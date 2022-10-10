import {Prisma} from '@prisma/client';
import {Credentials} from '../../types/auth';
import {User} from '../../types/users';
import {encryptPassword} from '../utils/password';
import {getPrismaClient} from '../utils/prisma';

const prisma = getPrismaClient();

export const getUser = async (credentials: Credentials): Promise<User> => await prisma.user.findFirst({
    where: {
        login: credentials.login,
        password: encryptPassword(credentials.password)
    }
});

export const createUser = async (data: Prisma.UserUncheckedCreateInput): Promise<User> => await prisma.user.create({
    data: {
        ...data,
        Account: {
            createMany: {
                data: [
                    {
                        accountType: 'Expense',
                        builtIn: true,
                        name: 'Cash Expense'
                    },
                    {
                        accountType: 'Revenue',
                        builtIn: true,
                        name: 'Cash Income'
                    }
                ]
            }
        },
        password: encryptPassword(data.password)
    }
});
