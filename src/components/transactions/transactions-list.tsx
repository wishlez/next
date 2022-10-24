import Link from 'next/link';
import {FunctionComponent, useEffect, useMemo} from 'react';
import useSWR, {useSWRConfig} from 'swr';
import {normalizeDate} from '../../services/utils/date';
import {doGet} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {DateParts} from '../../types/date';
import {Transaction, WithStartingDate, WithTransactions} from '../../types/transactions';
import styles from '../table.module.css';
import {useRouterQuery} from '../use-router-query';
import {TransactionItem} from './transaction-item';

const getMonthQuery = (range: DateParts, multiplier: -1 | 1): DateParts => {
    const {year, month} = normalizeDate({
        ...range,
        month: range.month + multiplier * 1
    });

    return {
        ...range,
        month,
        year
    };
};

export const TransactionsList: FunctionComponent = () => {
    const {buildQuery, getQuery, updateQuery} = useRouterQuery();

    const {data: startingDate} = useSWR<WithStartingDate>(swrKeys.startingDate);
    const range: DateParts = useMemo(() => ({
        month: getQuery('month', startingDate.startingDate.month),
        year: getQuery('year', startingDate.startingDate.year)
    }), [getQuery, startingDate.startingDate.month, startingDate.startingDate.year]);
    const swrKey = [swrKeys.transactions, range];
    const {data: transactions, error} = useSWR<WithTransactions>(swrKey, doGet);
    const {mutate} = useSWRConfig();

    const refresh = async (): Promise<void> => {
        await mutate(swrKey);
    };

    useEffect(() => {
        updateQuery(range);
    }, [range, updateQuery]);

    return (
        <>
            {error && 'Failed to load transactions'}
            <Link href={buildQuery(getMonthQuery(range, 1))}>{'\u226A Next Month'}</Link>
            {' '}
            <Link href={buildQuery(getMonthQuery(range, -1))}>{'Previous Month \u226B'}</Link>
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
                    {transactions?.transactions.map((transaction: Transaction) => (
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
