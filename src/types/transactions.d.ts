import type {Transaction as PrismaTransaction, TransactionTag as PrismaTransactionTag} from '@prisma/client';
import {Account} from './accounts';
import {AdjustedOptions} from './options';
import {Tag} from './tags';

type TransactionTag = PrismaTransactionTag & {
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
