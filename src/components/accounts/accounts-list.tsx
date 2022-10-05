import Link from 'next/link';
import {FunctionComponent} from 'react';
import useSWR, {useSWRConfig} from 'swr';
import {doDelete, doGet} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {Account, WithAccounts} from '../../types/accounts';
import {Icon} from '../icon';

export const AccountsList: FunctionComponent = () => {
    const {data, error} = useSWR<WithAccounts>(swrKeys.accounts, doGet);
    const {mutate} = useSWRConfig();

    const handleDelete = (account: Account) => async (): Promise<void> => {
        const canDelete = confirm(`Do you want to delete ${account.name}?`);

        if (canDelete) {
            await doDelete(swrKeys.accounts, {id: account.id.toString()});
            await mutate(swrKeys.accounts);
        }
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
                        <tr key={account.id}>
                            <td>
                                {account.name}
                            </td>
                            <td>
                                {account.accountType}
                            </td>
                            <td>
                                {!account.builtIn && '0'}
                            </td>
                            <td>
                                {account.builtIn ? (
                                    <Icon name={'lock'}/>
                                ) : (
                                    <>
                                        <Link href={`edit?id=${account.id}`}>
                                            <button type={'button'}>
                                                <Icon name={'edit'}/>
                                            </button>
                                        </Link>
                                        <button
                                            onClick={handleDelete(account)}
                                            type={'button'}
                                        >
                                            <Icon name={'delete'}/>
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};
