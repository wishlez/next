import type {Transaction as PrismaTransaction, TransactionTag as PrismaTransactionTag} from '@prisma/client';
import {Account} from './accounts';
import {DateParts} from './date';
import {AdjustedOptions} from './options';
import {Query, QueryValue} from './query';
import {Tag} from './tags';

export type TransactionTag = PrismaTransactionTag & {
    Tag?: Tag
    Transaction?: Transaction
};

export type Transaction = Omit<PrismaTransaction, 'amount' | 'date'> & {
    amount: number
    date: string
    FromAccount?: Account
    ToAccount?: Account
    TransactionTag?: TransactionTag[]
};

export interface TransactionQuery extends Query {
    year?: QueryValue;
    month?: QueryValue;
    accountId?: QueryValue;
    tagId?: QueryValue;
}

export type WithStartingDate<P = Record> = P & {
    startingDate: DateParts
}

export type WithTransaction<P = Record> = P & {
    transaction: Transaction
};

export type WithTransactions<P = Record> = P & {
    transactions: Transaction[]
};

export type TransactionRequest = Omit<Transaction, 'id' | 'userId'> & {
    id?: number
    tags: AdjustedOptions
};
