import {Account as PrismaAccount, Prisma} from '@prisma/client';
import {Account} from '../../types/accounts';
import {getPrismaClient} from '../utils/prisma';

const prisma = getPrismaClient();

type PartialTransaction = { amount: Prisma.Decimal };
type AccountWithTransaction = PrismaAccount & {
    Incoming?: PartialTransaction[]
    Outgoing?: PartialTransaction[]
};

const serializeTransactionAmount = ({amount}: PartialTransaction): { amount: number } => ({amount: amount.toNumber()});

const serialize = (account: AccountWithTransaction): Account => ({
    ...account,
    Incoming: account.Incoming?.map(serializeTransactionAmount) || [],
    Outgoing: account.Outgoing?.map(serializeTransactionAmount) || [],
    maximumAmountOwed: account.maximumAmountOwed.toNumber(),
    openingBalance: account.openingBalance.toNumber()
});

export const getAccounts = async (User: Prisma.UserWhereInput): Promise<Account[]> => {
    const accounts: AccountWithTransaction[] = await prisma.account.findMany({
        include: {
            Incoming: {
                select: {
                    amount: true
                }
            },
            Outgoing: {
                select: {
                    amount: true
                }
            }
        },
        orderBy: [
            {builtIn: 'desc'},
            {name: 'asc'}
        ],
        where: {
            User
        }
    });

    return accounts.map(serialize);
};

export const getAccount = async (id: number): Promise<Account> => {
    const account = await prisma.account.findUnique({
        where: {
            id
        }
    });

    if (!account) {
        return null;
    }

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
