import {useRouter} from 'next/router';
import {FunctionComponent} from 'react';
import useSWR from 'swr';
import {doPut} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {TransactionRequest, WithTransaction} from '../../types/transactions';
import {TransactionForm} from './transaction-form';

export const TransactionUpdate: FunctionComponent = () => {
    const router = useRouter();
    const {data, error} = useSWR<WithTransaction>(`${swrKeys.transactions}/${router.query.id}`);

    const closeForm = (): Promise<boolean> => router.push('/transactions');

    const saveTransaction = async (transaction: TransactionRequest): Promise<void> => {
        await doPut(swrKeys.transactions, {
            ...data?.transaction,
            ...transaction
        });
        await closeForm();
    };

    if (error) {
        return <>{'Failed to load transaction'}</>;
    }

    return (
        <TransactionForm
            onCancel={closeForm}
            onSubmit={saveTransaction}
            title={`Edit transaction #${data?.transaction.id}`}
            transaction={data?.transaction}
        />
    );
};
