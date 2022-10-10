import {FunctionComponent} from 'react';
import useSWR, {useSWRConfig} from 'swr';
import {doGet} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {Account, WithAccounts} from '../../types/accounts';
import {AccountItem} from './account-item';

export const AccountsList: FunctionComponent = () => {
    const {data, error} = useSWR<WithAccounts>(swrKeys.accounts, doGet);
    const {mutate} = useSWRConfig();

    const refresh = async (): Promise<void> => {
        await mutate(swrKeys.accounts);
    };

    return (
        <>
            {error && 'Failed to load accounts'}
            <table>
                <thead>
                    <tr>
                        <th>{'Name'}</th>
                        <th>{'Type'}</th>
                        <th>{'Balance'}</th>
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
