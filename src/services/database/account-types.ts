import {AccountType} from '../../types/account-types';

export const getAccountTypes = async (): Promise<AccountType[]> => await prisma.accountType.findMany({}) as AccountType[];
