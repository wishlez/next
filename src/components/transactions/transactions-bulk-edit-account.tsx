import {FunctionComponent, useRef} from 'react';
import useSWR from 'swr';
import {doPut} from '../../services/utils/fetch';
import {getOptions} from '../../services/utils/options';
import {swrKeys} from '../../services/utils/swr-keys';
import {WithAccounts} from '../../types/accounts';
import {Dialog} from '../../types/dialog';
import {Label} from '../label';
import {TransactionsBulkEditDialog} from './transactions-bulk-edit-dialog';

type Props = {
    ids: number[]
    onUpdate: () => void
    type: 'from' | 'to'
}

export const TransactionsBulkEditAccount: FunctionComponent<Props> = (props) => {
    const dialogRef = useRef<Dialog>();
    const accountRef = useRef<HTMLSelectElement>();
    const {data: accounts} = useSWR<WithAccounts>(swrKeys.accounts);

    const accountOptions = getOptions(accounts?.accounts, 'name', 'id');

    const updateTransactions = async (): Promise<void> => {
        await doPut(swrKeys.transactionsAccount, {
            accountId: Number(accountRef.current.value),
            ids: props.ids,
            type: props.type
        });
    };

    const handleClose = async (): Promise<void> => {
        if (dialogRef.current.returnValue === 'update' && accountRef.current.value) {
            await updateTransactions();

            accountRef.current.value = '';
            props.onUpdate();
        }
    };

    return (
        <TransactionsBulkEditDialog
            buttonText={`Account ${props.type}`}
            onClose={handleClose}
            ref={dialogRef}
        >
            <Label>
                {`Select ${props.type} account`}
                <select
                    autoFocus
                    name={'accountId'}
                    ref={accountRef}
                >
                    {accountOptions}
                </select>
            </Label>
        </TransactionsBulkEditDialog>
    );
};
