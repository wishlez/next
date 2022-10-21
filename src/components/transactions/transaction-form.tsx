import React, {FunctionComponent, SyntheticEvent, useRef} from 'react';
import useSWR from 'swr';
import {doGet} from '../../services/utils/fetch';
import {getAdjustedOptions, getOptions, getSelectedOptions} from '../../services/utils/options';
import {swrKeys} from '../../services/utils/swr-keys';
import {WithAccounts} from '../../types/accounts';
import {WithTags} from '../../types/tags';
import {Transaction, TransactionRequest, TransactionTag, WithTransactions} from '../../types/transactions';
import {Label} from '../label';
import {TransactionDescriptionInput} from './transaction-description-input';

type Props = {
    onCancel: () => void
    onSubmit: (transaction: TransactionRequest, more: boolean) => void
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
    const {data: transactions, mutate} = useSWR<WithTransactions>(swrKeys.transactionSuggestions, doGet);
    const existingTags = getExistingTags(props.transaction?.TransactionTag);

    const submitTransaction = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>): Promise<void> => {
        event.preventDefault();

        const more = (event.nativeEvent.submitter as HTMLButtonElement).value === 'yes';
        const retainDate = dateRef.current.value;
        await props.onSubmit({
            amount: Number(amountRef.current.value),
            date: retainDate,
            description: descriptionRef.current.value,
            fromAccountId: Number(fromAccountRef.current.value),
            tags: getAdjustedOptions(existingTags, getSelectedOptions(tagsRef.current)),
            toAccountId: Number(toAccountRef.current.value)
        }, more);
        await mutate();

        if (more) {
            (event.nativeEvent.target as HTMLFormElement).reset();
            dateRef.current.value = retainDate;
            descriptionRef.current.focus();
        }
    };

    const accountOptions = getOptions(accounts?.accounts, 'name', 'id');
    const tagOptions = getOptions(tags?.tags, 'name', 'id');

    return (
        <form onSubmit={submitTransaction}>
            <h2>
                {props.title}
            </h2>
            <div>
                <TransactionDescriptionInput
                    autocompleteOptions={transactions?.transactions}
                    onAutocomplete={(transaction): void => {
                        if (!props.transaction || confirm('Override other input values with autocompletion?')) {
                            amountRef.current.value = transaction.amount.toString();
                            descriptionRef.current.value = transaction.description;
                            fromAccountRef.current.value = transaction.fromAccountId.toString();
                            toAccountRef.current.value = transaction.toAccountId.toString();

                            const transactionTags = getExistingTags(transaction.TransactionTag);

                            Array.from(tagsRef.current.options).forEach((option) => {
                                option.selected = transactionTags.includes(Number(option.value));
                            });

                            amountRef.current.select();
                        }
                    }}
                    ref={descriptionRef}
                    transaction={props.transaction}
                />
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
                    {'Transaction amount:'}
                    <input
                        defaultValue={props.transaction?.amount}
                        min={0}
                        name={'amount'}
                        placeholder={'Enter transaction amount'}
                        ref={amountRef}
                        required
                        step={0.01}
                        type={'number'}
                    />
                </Label>
                <Label>
                    {'Transaction date:'}
                    <input
                        defaultValue={props.transaction?.date}
                        name={'date'}
                        placeholder={'Enter transaction date'}
                        ref={dateRef}
                        required
                        type={'date'}
                    />
                </Label>
                <Label>
                    {'Tags:'}
                    <select
                        defaultValue={existingTags.map((id) => id.toString())}
                        multiple
                        name={'tags'}
                        ref={tagsRef}
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
                {props.transaction ? <button type={'submit'}>{'Update'}</button> : (
                    <>
                        <button
                            name={'continue'}
                            type={'submit'}
                            value={'yes'}
                        >
                            {'Add more'}
                        </button>
                        <button
                            name={'continue'}
                            type={'submit'}
                            value={'no'}
                        >
                            {'Add one'}
                        </button>
                    </>
                )}
            </div>
        </form>
    );
};
