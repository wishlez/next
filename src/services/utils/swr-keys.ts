export type Parameterized<A extends SwrKeys[keyof SwrKeys]> = A extends string ? `${A}/${string}` : A extends Record<string, string> ? `${A[keyof A]}/${string}` : never;

export type SwrKeys = typeof swrKeys;

export const swrKeys = {
    accountTypes: '/api/accounts/types',
    accounts: '/api/accounts',
    startingDate: './api/transactions/starting-date',
    tags: '/api/tags',
    transactionSuggestions: '/api/transactions/suggestions',
    transactions: '/api/transactions',
    transactionsEdit: {
        description: '/api/transactions/edit/description',
        fromAccount: '/api/transactions/edit/account?type=from',
        tags: '/api/transactions/edit/tags',
        toAccount: '/api/transactions/edit/account?type=to'
    }
} as const;
