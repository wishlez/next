export type Parameterized<A extends SwrKeys[keyof SwrKeys]> = A extends string ? `${A}/${string}` : never;

export type SwrKeys = typeof swrKeys;

export const swrKeys = {
    accountTypes: '/api/accounts/types',
    accounts: '/api/accounts',
    startingDate: './api/transactions/starting-date',
    tags: '/api/tags',
    transactionSuggestions: '/api/transactions/suggestions',
    transactions: '/api/transactions',
    transactionsAccount: '/api/transactions/account',
    transactionsDescription: '/api/transactions/description',
    transactionsTags: '/api/transactions/tags',
} as const;
