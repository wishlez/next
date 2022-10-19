import {Prisma, Transaction as PrismaTransaction} from '@prisma/client';
import {AdjustedOptions} from '../../types/options';
import {Transaction} from '../../types/transactions';
import {toDateString} from '../utils/date';
import {getPrismaClient} from '../utils/prisma';

const prisma = getPrismaClient();

const serialize = (transaction: PrismaTransaction): Transaction => ({
    ...transaction,
    amount: transaction.amount.toNumber(),
    date: toDateString(transaction.date)
});

export const getTransactions = async (User: Prisma.UserWhereInput): Promise<Transaction[]> => {
    const transactions = await prisma.transaction.findMany({
        include: {
            FromAccount: {
                select: {
                    name: true
                }
            },
            ToAccount: {
                select: {
                    name: true
                }
            },
            TransactionTag: {
                select: {
                    Tag: true
                }
            }
        },
        where: {
            User
        }
    });

    return transactions.map(serialize);
};

export const getTransaction = async (id: number): Promise<Transaction> => {
    const transaction = await prisma.transaction.findUnique({
        include: {
            TransactionTag: {
                select: {
                    Tag: true
                }
            }
        },
        where: {
            id
        }
    });

    return serialize(transaction);
};

export const createTransaction = async (data: Prisma.TransactionUncheckedCreateInput, tags: AdjustedOptions): Promise<Transaction> => serialize(await prisma.transaction.create({
    data: {
        ...data,
        TransactionTag: {
            createMany: {
                data: tags.added.map((tagId) => ({tagId}))
            }
        }
    }
}));

export const deleteTransaction = async (id: number): Promise<void> => {
    await prisma.transaction.delete({
        where: {
            id
        }
    });
};

export const updateTransaction = async (data: Prisma.TransactionUncheckedUpdateInput, tags: AdjustedOptions): Promise<Transaction> => serialize(await prisma.transaction.update({
    data: {
        ...data,
        TransactionTag: {
            createMany: {
                data: tags.added.map((tagId) => ({tagId}))
            },
            deleteMany: {
                tagId: {
                    in: tags.deleted
                }
            }
        }
    },
    where: {
        id: data.id as number
    }
}));
