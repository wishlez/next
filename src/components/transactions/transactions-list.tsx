import Link from 'next/link';
import {FunctionComponent, useEffect} from 'react';
import useSWR, {useSWRConfig} from 'swr';
import {doGet} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {Transaction, WithTransactions} from '../../types/transactions';
import styles from '../table.module.css';
import {useRouterQuery} from '../use-router-query';
import {TransactionItem} from './transaction-item';

const pageParam = 'page';
const sizeParam = 'size';

export const TransactionsList: FunctionComponent = () => {
    const {buildQuery, getQuery, pushQuery, updateQuery} = useRouterQuery();
    const currentPage = getQuery(pageParam, 1);
    const currentSize = getQuery(sizeParam, 50);

    const swrKey = [swrKeys.transactions, {
        page: currentPage,
        size: currentSize
    }];
    const {data, error} = useSWR<WithTransactions>(swrKey, doGet);
    const {mutate} = useSWRConfig();

    const refresh = async (): Promise<void> => {
        await mutate(swrKey);
    };

    useEffect(() => {
        updateQuery(pageParam, currentPage);
        updateQuery(sizeParam, currentSize);
    }, [currentPage, currentSize, updateQuery]);

    return (
        <>
            {error && 'Failed to load transactions'}
            {currentPage > 1 && <Link href={buildQuery(pageParam, currentPage - 1)}>{'\u226APrev'}</Link>}
            {currentPage > 1 && ' '}
            <Link href={buildQuery(pageParam, currentPage + 1)}>{'Next \u226B'}</Link>
            {'Show per page: '}
            <select
                onChange={(event): Promise<void> => pushQuery(sizeParam, event.target.value)}
                value={currentSize}
            >
                <option value={10}>{10}</option>
                <option value={25}>{25}</option>
                <option value={50}>{50}</option>
                <option value={100}>{100}</option>
            </select>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>{'Description'}</th>
                        <th>{'From Account'}</th>
                        <th>{'To Account'}</th>
                        <th>{'Date'}</th>
                        <th>{'Tags'}</th>
                        <th style={{textAlign: 'right'}}>{'Amount'}</th>
                        <th/>
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
