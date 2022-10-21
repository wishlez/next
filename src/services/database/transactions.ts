import {Prisma, Transaction as PrismaTransaction} from '@prisma/client';
import {AdjustedOptions} from '../../types/options';
import {Transaction, TransactionTag} from '../../types/transactions';
import {toDateString} from '../utils/date';
import {getPrismaClient} from '../utils/prisma';

const prisma = getPrismaClient();

const serialize = (transaction: PrismaTransaction): Transaction => ({
    ...transaction,
    amount: transaction.amount.toNumber(),
    date: toDateString(transaction.date)
});

export const getTransactionSuggestions = async (User: Prisma.UserWhereInput): Promise<Transaction[]> => {
    let transactions: PrismaTransaction[] = await prisma.$queryRaw<PrismaTransaction[]>`
        SELECT t.* FROM
            Transaction t,
            (
                SELECT description, fromAccountId, toAccountId, MAX(DATE) maxDate FROM Transaction
                WHERE userId = ${User.id}
                GROUP BY description, fromAccountId, toAccountId
            ) m
        WHERE
            userId = ${User.id}
            AND t.description = m.description
            AND t.fromAccountId = m.fromAccountId
            AND t.toAccountId = m.toAccountId
            AND t.date = m.maxDate
        ORDER BY DATE DESC
    `;

    const transactionIds = transactions.map(({id}) => id);
    const tags = await prisma.transactionTag.findMany({
        include: {
            Tag: true
        },
        where: {
            transactionId: {
                in: transactionIds
            }
        }
    });
    const tagsIndex = tags.reduce<Record<string, TransactionTag[]>>((index, {transactionId, Tag}) => ({
        ...index,
        [transactionId]: [
            ...index[transactionId] || [],
            {Tag}
        ]
    }), {});

    transactions = transactions.map((transaction) => ({
        ...transaction,
        TransactionTag: tagsIndex[transaction.id] || []
    }));

    return transactions.map(serialize);
};

export const getTransactions = async (User: Prisma.UserWhereInput, size: number, page: number): Promise<Transaction[]> => {
    const take = size || undefined;
    const skip = ((page - 1) * take) || undefined;

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
        orderBy: [
            {date: 'desc'},
            {id: 'desc'}
        ],
        skip,
        take,
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
