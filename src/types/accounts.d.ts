import type {Account as PrismaAccount} from '@prisma/client';

export type Account = Omit<PrismaAccount, 'openingBalance' | 'maximumAmountOwed'> & {
    openingBalance: number
    maximumAmountOwed: number
};

export type WithAccount<P = Record> = P & {
    account: Account
};

export type WithAccounts<P = Record> = P & {
    accounts: Account[]
};

export type AccountRequest = Omit<Account, 'id' | 'builtIn' | 'userId'> & {
    id?: number
};
