import {FunctionComponent} from 'react';
import useSWR, {useSWRConfig} from 'swr';
import {doGet} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {Account, WithAccounts} from '../../types/accounts';
import {AccountItem} from './account-item';
import styles from '../table.module.css';

export const AccountsList: FunctionComponent = () => {
    const {data, error} = useSWR<WithAccounts>(swrKeys.accounts, doGet);
    const {mutate} = useSWRConfig();

    const refresh = async (): Promise<void> => {
        await mutate(swrKeys.accounts);
    };

    return (
        <>
            {error && 'Failed to load accounts'}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>{'Name'}</th>
                        <th>{'Type'}</th>
                        <th style={{textAlign: 'right'}}>{'Balance'}</th>
                        <th/>
                    </tr>
                </thead>
                <tbody>
                    {data?.accounts.map((account: Account) => (
                        <AccountItem
                            account={account}
                            key={account.id}
                            onChange={refresh}
                        />
                    ))}
                </tbody>
            </table>
        </>
    );
};
