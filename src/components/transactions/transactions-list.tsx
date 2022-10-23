import Link from 'next/link';
import {NextRouter, useRouter} from 'next/router';
import {FunctionComponent, useEffect} from 'react';
import useSWR, {useSWRConfig} from 'swr';
import {UrlObject} from 'url';
import {doGet} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {Transaction, WithTransactions} from '../../types/transactions';
import {TransactionItem} from './transaction-item';
import styles from '../table.module.css';

const pushRoute = (router: NextRouter, queryName: string, value: string | number, shallow?: boolean): void => {
    router.push({
        pathname: router.pathname,
        query: {
            ...router.query,
            [queryName]: value
        }
    }, undefined, {
        shallow
    });
};

const updatePath = (router: NextRouter, queryName: string, value: string | number): void => {
    if (!router.query[queryName]) {
        pushRoute(router, queryName, value, true);
    }
};

const getPageUrl = (router: NextRouter, page: number): UrlObject => ({
    query: {
        ...router.query,
        page: page.toString()
    }
});

export const TransactionsList: FunctionComponent = () => {
    const router = useRouter();
    const currentPage = Number(router.query.page) || 1;
    const currentSize = Number(router.query.size) || 50;

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
        updatePath(router, 'page', 1);
        updatePath(router, 'size', currentSize);
    }, [router, currentSize]);

    return (
        <>
            {error && 'Failed to load transactions'}
            {currentPage > 1 && <Link href={getPageUrl(router, currentPage - 1)}>{'\u226APrev'}</Link>}
            {currentPage > 1 && ' '}
            <Link href={getPageUrl(router, currentPage + 1)}>{'Next \u226B'}</Link>
            {'Show per page: '}
            <select
                onChange={(event): void => pushRoute(router, 'size', event.target.value)}
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
