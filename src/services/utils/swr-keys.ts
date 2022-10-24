export type Parameterized<A extends SwrKeys[keyof SwrKeys]> = `${A}/${string}`;

export type SwrKeys = typeof swrKeys;

export const swrKeys = {
    accountTypes: '/api/accounts/types',
    accounts: '/api/accounts',
    startingDate: './api/transactions/starting-date',
    tags: '/api/tags',
    transactionSuggestions: '/api/transactions/suggestions',
    transactions: '/api/transactions'
} as const;
