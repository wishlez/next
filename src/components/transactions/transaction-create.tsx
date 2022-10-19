import {useRouter} from 'next/router';
import {FunctionComponent} from 'react';
import {doPost} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {TransactionRequest} from '../../types/transactions';
import {TransactionForm} from './transaction-form';

export const TransactionCreate: FunctionComponent = () => {
    const router = useRouter();

    const closeForm = (): Promise<boolean> => router.push('/transactions');

    const createTransaction = async (transaction: TransactionRequest): Promise<void> => {
        await doPost(swrKeys.transactions, transaction);
        await closeForm();
    };

    return (
        <TransactionForm
            onCancel={closeForm}
            onSubmit={createTransaction}
            title={'Create new transaction'}
        />
    );
};
