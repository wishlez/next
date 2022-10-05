import {PrismaClient} from '@prisma/client';
import {AccountTypes} from '../src/types/account-types';

const data: { type: AccountTypes }[] = [
    {type: 'Asset'},
    {type: 'Expense'},
    {type: 'Revenue'},
    {type: 'Equity'},
    {type: 'Liability'}
];

export const seedAccountTypes = (prisma: PrismaClient, enabled: boolean): Promise<any> => {
    if (!enabled) {
        return;
    }

    return prisma.accountType.createMany({
        data
    });
};
