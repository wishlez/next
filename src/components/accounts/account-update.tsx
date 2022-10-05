import {useRouter} from 'next/router';
import {FunctionComponent} from 'react';
import useSWR from 'swr';
import {doPut} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {AccountRequest, WithAccount} from '../../types/accounts';
import {AccountForm} from './account-form';

export const AccountUpdate: FunctionComponent = () => {
    const router = useRouter();
    const {data, error} = useSWR<WithAccount>(`${swrKeys.accounts}/${router.query.id}`);

    const closeForm = (): Promise<boolean> => router.push('/accounts');

    const saveAccount = async (account: AccountRequest): Promise<void> => {
        await doPut(swrKeys.accounts, {
            ...data?.account,
            ...account
        });
        await closeForm();
    };

    if (error) {
        return <>{'Failed to load account'}</>;
    }

    return (
        <AccountForm
            account={data?.account}
            onCancel={closeForm}
            onSubmit={saveAccount}
            title={`Edit account #${data?.account.id}`}
        />
    );
};
