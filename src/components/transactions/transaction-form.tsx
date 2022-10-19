import {FormEvent, FunctionComponent, useRef} from 'react';
import useSWR from 'swr';
import {getAdjustedOptions, getOptions, getSelectedOptions} from '../../services/utils/options';
import {swrKeys} from '../../services/utils/swr-keys';
import {WithAccounts} from '../../types/accounts';
import {WithTags} from '../../types/tags';
import {Transaction, TransactionRequest, TransactionTag} from '../../types/transactions';
import {Label} from '../label';

type Props = {
    onCancel: () => void
    onSubmit: (transaction: TransactionRequest) => void
    transaction?: Transaction
    title: string
}

const getExistingTags = (transactionTags: TransactionTag[] = []): number[] => transactionTags.map(({Tag}) => Tag.id);

export const TransactionForm: FunctionComponent<Props> = (props) => {
    const descriptionRef = useRef<HTMLInputElement>();
    const dateRef = useRef<HTMLInputElement>();
    const amountRef = useRef<HTMLInputElement>();
    const fromAccountRef = useRef<HTMLSelectElement>();
    const toAccountRef = useRef<HTMLSelectElement>();
    const tagsRef = useRef<HTMLSelectElement>();
    const {data: accounts} = useSWR<WithAccounts>(swrKeys.accounts);
    const {data: tags} = useSWR<WithTags>(swrKeys.tags);
    const existingTags = getExistingTags(props.transaction?.TransactionTag);

    const submitTransaction = async (event: FormEvent): Promise<void> => {
        event.preventDefault();

        await props.onSubmit({
            amount: Number(amountRef.current.value),
            date: dateRef.current.value,
            description: descriptionRef.current.value,
            fromAccountId: Number(fromAccountRef.current.value),
            tags: getAdjustedOptions(existingTags, getSelectedOptions(tagsRef.current)),
            toAccountId: Number(toAccountRef.current.value)
        });
    };

    const accountOptions = getOptions(accounts?.accounts, 'name', 'id');
    const tagOptions = getOptions(tags?.tags, 'name', 'id');

    return (
        <form onSubmit={submitTransaction}>
            <h2>
                {props.title}
            </h2>
            <div>
                <Label>
                    {'Description'}
                    <input
                        autoFocus
                        defaultValue={props.transaction?.description}
                        placeholder={'Describe transaction'}
                        ref={descriptionRef}
                        required
                        type={'text'}
                    />
                </Label>
                <Label>
                    {'From account:'}
                    <select
                        defaultValue={props.transaction?.fromAccountId}
                        name={'fromAccountId'}
                        ref={fromAccountRef}
                        required
                    >
                        {accountOptions}
                    </select>
                </Label>
                <Label>
                    {'To account:'}
                    <select
                        defaultValue={props.transaction?.toAccountId}
                        name={'toAccountId'}
                        ref={toAccountRef}
                        required
                    >
                        {accountOptions}
                    </select>
                </Label>
                <Label>
                    {'Transaction date:'}
                    <input
                        defaultValue={props.transaction?.date}
                        placeholder={'Enter transaction date'}
                        ref={dateRef}
                        required
                        type={'date'}
                    />
                </Label>
                <Label>
                    {'Transaction amount:'}
                    <input
                        defaultValue={props.transaction?.amount}
                        min={0}
                        placeholder={'Enter transaction amount'}
                        ref={amountRef}
                        step={0.01}
                        type={'number'}
                    />
                </Label>
                <Label>
                    {'Tags:'}
                    <select
                        defaultValue={existingTags.map((id) => id.toString())}
                        multiple
                        name={'toAccountId'}
                        ref={tagsRef}
                        required
                    >
                        {tagOptions}
                    </select>
                </Label>
            </div>
            <div>
                <button
                    onClick={props.onCancel}
                    type={'button'}
                >
                    {'Cancel'}
                </button>
                <button type={'submit'}>
                    {props.transaction ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
};
