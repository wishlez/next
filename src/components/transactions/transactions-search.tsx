import {useRouter} from 'next/router';
import {FunctionComponent} from 'react';
import useSWR from 'swr';
import {swrKeys} from '../../services/utils/swr-keys';
import {WithTransactions} from '../../types/transactions';
import {TransactionsFilterForm} from './transactions-filter-form';
import {TransactionsTable} from './transactions-table';

export const TransactionsSearch: FunctionComponent = () => {
    const router = useRouter();
    const {data: transactions, error} = useSWR<WithTransactions>(swrKeys.transactions);

    return (
        <>
            <TransactionsFilterForm/>
            {error && 'Failed to load transactions'}
            {!transactions?.transactions.length ? 'Update/apply the filters to see transactions' : (
                <TransactionsTable
                    onChange={(): void => router.reload()}
                    transactions={transactions?.transactions}
                />
            )}
        </>
    );
};
