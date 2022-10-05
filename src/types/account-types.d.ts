export type {AccountTypes, AccountType as PrismaAccountType} from '@prisma/client';

export type AccountType = Omit<PrismaAccountType, 'type'> & {
    type: AccountTypes
}

export type WithAccountTypes<P = AnyObject> = P & {
    accountTypes: AccountType[]
}
