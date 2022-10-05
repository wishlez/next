import {FormEvent, FunctionComponent, useRef} from 'react';
import useSWR from 'swr';
import {swrKeys} from '../../services/utils/swr-keys';
import {AccountType, AccountTypes, WithAccountTypes} from '../../types/account-types';
import {Account, AccountRequest} from '../../types/accounts';
import {Label} from '../label';

type Props = {
    onCancel: () => void
    onSubmit: (account: AccountRequest) => void
    account?: Account
    title: string
}

export const AccountForm: FunctionComponent<Props> = (props) => {
    const nameRef = useRef<HTMLInputElement>();
    const initialRef = useRef<HTMLInputElement>();
    const maximumRef = useRef<HTMLInputElement>();
    const accountTypeRef = useRef<HTMLSelectElement>();
    const {data} = useSWR<WithAccountTypes>(swrKeys.accountTypes);

    const submitAccount = async (event: FormEvent): Promise<void> => {
        event.preventDefault();

        await props.onSubmit({
            accountType: accountTypeRef.current.value as AccountTypes,
            maximumAmountOwed: Number(maximumRef.current.value) || 0,
            name: nameRef.current.value,
            openingBalance: Number(initialRef.current.value) || 0
        });
    };

    return (
        <form onSubmit={submitAccount}>
            <h2>
                {props.title}
            </h2>
            <div>
                <Label>
                    <input
                        autoFocus
                        defaultValue={props.account?.name}
                        placeholder={'Enter account name'}
                        ref={nameRef}
                        required
                        type={'text'}
                    />
                </Label>
                <Label>
                    <input
                        defaultValue={props.account?.openingBalance}
                        min={0}
                        placeholder={'Enter initial balance'}
                        ref={initialRef}
                        step={0.01}
                        type={'number'}
                    />
                    {'The current balance after which the transactions are tracked. (Optional)'}
                </Label>
                <Label>
                    <input
                        defaultValue={props.account?.maximumAmountOwed}
                        min={0}
                        placeholder={'Enter maximum limit'}
                        ref={maximumRef}
                        step={0.01}
                        type={'number'}
                    />
                    {'Maximum amount e.g. credit line, or total loan owed. (Optional)'}
                </Label>
                <Label>
                    {'Select a type:'}
                    <select
                        defaultValue={props.account?.accountType}
                        name={'accountType'}
                        ref={accountTypeRef}
                    >
                        {data?.accountTypes.map(({type}: AccountType) => (
                            <option
                                key={type}
                                value={type}
                            >
                                {type}
                            </option>
                        ))}
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
                    {props.account ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
};
