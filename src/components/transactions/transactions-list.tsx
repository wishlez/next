import Link from 'next/link';
import {FunctionComponent, useEffect, useMemo} from 'react';
import useSWR, {useSWRConfig} from 'swr';
import {normalizeDate} from '../../services/utils/date';
import {doGet} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {DateParts} from '../../types/date';
import {WithStartingDate, WithTransactions} from '../../types/transactions';
import {NavContainer} from '../nav-container';
import {useRouterQuery} from '../use-router-query';
import {TransactionsTable} from './transactions-table';

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
    const {buildQuery, getQuery, router, updateQuery} = useRouterQuery();

    const {data: startingDate} = useSWR<WithStartingDate>(swrKeys.startingDate);
    const range: DateParts = useMemo(() => ({
        ...router.query,
        month: getQuery('month', startingDate.startingDate.month),
        year: getQuery('year', startingDate.startingDate.year)
    }), [getQuery, router, startingDate.startingDate.month, startingDate.startingDate.year]);
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
            <NavContainer>
                <Link href={buildQuery(getMonthQuery(range, 1))}>{'\u226A Next Month'}</Link>
                <Link href={buildQuery(getMonthQuery(range, -1))}>{'Previous Month \u226B'}</Link>
                <Link href={'search'}>{'Search All'}</Link>
            </NavContainer>
            <TransactionsTable
                onChange={refresh}
                transactions={transactions?.transactions}
            />
        </>
    );
};
