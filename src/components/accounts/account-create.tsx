import {useRouter} from 'next/router';
import {FunctionComponent} from 'react';
import {doPost} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {AccountRequest} from '../../types/accounts';
import {AccountForm} from './account-form';

export const AccountCreate: FunctionComponent = () => {
    const router = useRouter();

    const closeForm = (): Promise<boolean> => router.push('/accounts');

    const createAccount = async (account: AccountRequest): Promise<void> => {
        await doPost(swrKeys.accounts, account);
        await closeForm();
    };

    return (
        <AccountForm
            onCancel={closeForm}
            onSubmit={createAccount}
            title={'Create new account'}
        />
    );
};
