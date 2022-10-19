import {FunctionComponent} from 'react';
import useSWR, {useSWRConfig} from 'swr';
import {doGet} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {Transaction, WithTransactions} from '../../types/transactions';
import {TransactionItem} from './transaction-item';

export const TransactionsList: FunctionComponent = () => {
    const {data, error} = useSWR<WithTransactions>(swrKeys.transactions, doGet);
    const {mutate} = useSWRConfig();

    const refresh = async (): Promise<void> => {
        await mutate(swrKeys.transactions);
    };

    return (
        <>
            {error && 'Failed to load transactions'}
            <table>
                <thead>
                    <tr>
                        <th>{'Description'}</th>
                        <th>{'From Account'}</th>
                        <th>{'To Account'}</th>
                        <th>{'Date'}</th>
                        <th>{'Tags'}</th>
                        <th>{'Amount'}</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.transactions.map((transaction: Transaction) => (
                        <TransactionItem
                            key={transaction.id}
                            onChange={refresh}
                            transaction={transaction}
                        />
                    ))}
                </tbody>
            </table>
        </>
    );
};
