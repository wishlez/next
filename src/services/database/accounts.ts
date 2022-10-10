import {Account as PrismaAccount, Prisma} from '@prisma/client';
import {Account} from '../../types/accounts';
import {getPrismaClient} from '../utils/prisma';

const prisma = getPrismaClient();

const serialize = (account: PrismaAccount): Account => ({
    ...account,
    maximumAmountOwed: account.maximumAmountOwed.toNumber(),
    openingBalance: account.openingBalance.toNumber()
});

export const getAccounts = async (User: Prisma.UserWhereInput): Promise<Account[]> => {
    const accounts = await prisma.account.findMany({
        where: {
            User
        }
    });

    return accounts.map(serialize);
};

export const getAccount = async (id: number): Promise<Account> => {
    const account = await prisma.account.findFirst({
        where: {
            id
        }
    });

    return serialize(account);
};

export const createAccount = async (data: Prisma.AccountUncheckedCreateInput): Promise<Account> => serialize(await prisma.account.create({
    data
}));

export const deleteAccount = async (id: number): Promise<void> => {
    await prisma.account.delete({
        where: {
            id
        }
    });
};

export const updateAccount = async (data: Prisma.AccountUncheckedUpdateInput): Promise<Account> => serialize(await prisma.account.update({
    data,
    where: {
        id: data.id as number
    }
}));

export const getAccountUserId = async (id: number): Promise<number> => (await prisma.account.findUnique({
    where: {
        id
    }
})).userId;
