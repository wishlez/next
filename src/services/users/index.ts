import {Prisma} from '@prisma/client';
import {Credentials} from '../../types/auth';
import {User} from '../../types/user';
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
        password: encryptPassword(data.password)
    }
});
