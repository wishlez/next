import {Prisma, Transaction as PrismaTransaction} from '@prisma/client';
import {DateParts} from '../../types/date';
import {AdjustedOptions} from '../../types/options';
import {QueryValue} from '../../types/query';
import {Transaction, TransactionQuery, TransactionTag} from '../../types/transactions';
import {normalizeDate, toDateObject, toDateString} from '../utils/date';
import {parseQueryNumber, parseQueryNumbers} from '../utils/number';
import {getPrismaClient} from '../utils/prisma';

const prisma = getPrismaClient();

const serialize = (transaction: PrismaTransaction): Transaction => ({
    ...transaction,
    amount: transaction.amount.toNumber(),
    date: toDateString(transaction.date)
});

const buildTransactionsCondition = (query: TransactionQuery): Prisma.TransactionWhereInput => {
    const description = query.description as string;
    const year = parseQueryNumber(query.year as string);
    const month = parseQueryNumber(query.month as string);
    const accountId = parseQueryNumber(query.accountId as string);
    const tagId = parseQueryNumbers(query.tagId as string[]);

    const tagLogic = tagId.length === 1 && tagId[0] === 0 ? 'every' : 'some';

    return {
        AND: {
            ...description && {
                description: {
                    search: description
                }
            },
            ...!isNaN(year) && isNaN(month) && {
                date: {
                    gte: toDateObject(year, 1, 1),
                    lt: toDateObject(year + 1, 1, 1)
                }
            },
            ...!isNaN(year) && !isNaN(month) && {
                date: {
                    gte: toDateObject(year, month, 1),
                    lt: toDateObject(year, month + 1, 1)
                }
            },
            ...!isNaN(accountId) && {
                OR: [
                    {fromAccountId: accountId},
                    {toAccountId: accountId}
                ]
            },
            ...tagId.length && {
                TransactionTag: {
                    [tagLogic]: {
                        tagId: {
                            in: tagId
                        }
                    }
                }
            }
        }
    };
};

export const getStartingDate = async (User: Prisma.UserWhereInput, year: QueryValue, month: QueryValue): Promise<DateParts> => {
    const y: number = Number(year) || NaN;
    const m: number = Number(month) || NaN;

    if (isNaN(y) || isNaN(m)) {
        const {_max: {date}} = await prisma.transaction.aggregate({
            _max: {
                date: true
            },
            where: {
                User
            }
        });

        const dateTime = normalizeDate(date || Date.now());

        return {
            month: dateTime.month,
            year: dateTime.year
        };
    }

    return {
        month: m,
        year: y
    };
};

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

export const getTransactions = async (User: Prisma.UserWhereInput, query: TransactionQuery): Promise<Transaction[]> => {
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
        where: buildTransactionsCondition(query)
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

    if (!transaction) {
        return null;
    }

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
