export type Parameterized<A extends SwrKeys[keyof SwrKeys]> = `${A}/${string}`;

export type SwrKeys = typeof swrKeys;

export const swrKeys = {
    accountTypes: '/api/accounts/types',
    accounts: '/api/accounts',
    tags: '/api/tags',
    transactions: '/api/transactions'
} as const;
