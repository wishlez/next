import {FunctionComponent, useState} from 'react';
import useSWR from 'swr';
import {doGet} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {TransactionQuery, WithTransactions} from '../../types/transactions';
import {useRouterQuery} from '../use-router-query';
import {TransactionsFilterForm} from './transactions-filter-form';
import {TransactionsTable} from './transactions-table';

const shouldFetch = (query: TransactionQuery): boolean =>
    [query.description, query.year, query.month, query.tagId, query.accountId].some((value) => value);

export const TransactionsSearch: FunctionComponent = () => {
    const {router, updateQuery} = useRouterQuery();
    const swrKey = [swrKeys.transactions, router.query];
    const {
        data: transactions,
        error,
        mutate
    } = useSWR<WithTransactions>(shouldFetch(router.query) ? swrKey : null, doGet);
    const [selected, setSelected] = useState<number[]>([]);

    const refresh = async (): Promise<void> => {
        await mutate(swrKey);
    };

    return (
        <>
            <TransactionsFilterForm onSubmit={updateQuery}/>
            {error && 'Failed to load transactions'}
            {!transactions?.transactions?.length ? 'Update/apply the filters to see transactions' : (
                <TransactionsTable
                    onChange={refresh}
                    onSelect={setSelected}
                    selectable
                    selected={selected}
                    transactions={transactions?.transactions}
                />
            )}
        </>
    );
};
