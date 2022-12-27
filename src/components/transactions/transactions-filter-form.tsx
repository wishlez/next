import {Button, ButtonGroup} from '@wishlez/ui';
import {useRouter} from 'next/router';
import {FormEvent, FunctionComponent, useRef} from 'react';
import useSWR from 'swr';
import {getMonthOptions, getYearOptions} from '../../services/utils/date';
import {getOptions, getSelectedOptions} from '../../services/utils/options';
import {swrKeys} from '../../services/utils/swr-keys';
import {WithAccounts} from '../../types/accounts';
import {WithTags} from '../../types/tags';
import {TransactionQuery} from '../../types/transactions';
import {Label} from '../label';

type Props = {
    onSubmit: (query: TransactionQuery) => void
};

export const TransactionsFilterForm: FunctionComponent<Props> = (props) => {
    const router = useRouter();
    const query: TransactionQuery = router.query;
    const {data: accounts} = useSWR<WithAccounts>(swrKeys.accounts);
    const {data: tags} = useSWR<WithTags>(swrKeys.tags);

    const descriptionRef = useRef<HTMLInputElement>();
    const yearRef = useRef<HTMLSelectElement>();
    const monthRef = useRef<HTMLSelectElement>();
    const accountRef = useRef<HTMLSelectElement>();
    const tagsRef = useRef<HTMLSelectElement>();

    const accountOptions = getOptions(accounts?.accounts, 'name', 'id');
    const tagOptions = getOptions(tags?.tags, 'name', 'id');

    const handleSubmit = (event: FormEvent): void => {
        event.preventDefault();

        props.onSubmit({
            accountId: accountRef.current.value,
            description: descriptionRef.current.value,
            month: monthRef.current.value,
            tagId: getSelectedOptions(tagsRef.current).map((value) => value.toString()),
            year: yearRef.current.value
        });
    };

    return (
        <form
            method={'get'}
            onSubmit={handleSubmit}
        >
            <fieldset>
                <legend>{'Search transactions'}</legend>
                <div
                    style={{
                        alignItems: 'end',
                        display: 'grid',
                        gridTemplateColumns: 'fit-content(100px) fit-content(100px)'
                    }}
                >
                    <div>
                        <Label>
                            {'Enter description'}
                            <input
                                defaultValue={query.description}
                                name={'description'}
                                placeholder={'+made -payment'}
                                ref={descriptionRef}
                                type={'text'}
                            />
                        </Label>
                        <Label>
                            {'Select a year'}
                            <select
                                defaultValue={query.year}
                                name={'year'}
                                ref={yearRef}
                            >
                                <option value={''}>{'All'}</option>
                                {getYearOptions()}
                            </select>
                        </Label>
                        <Label>
                            {'Select a month'}
                            <select
                                defaultValue={query.month}
                                name={'month'}
                                ref={monthRef}
                            >
                                <option value={''}>{'All'}</option>
                                {getMonthOptions()}
                            </select>
                        </Label>
                        <Label>
                            {'Select an account'}
                            <select
                                defaultValue={query.accountId}
                                name={'accountId'}
                                ref={accountRef}
                            >
                                <option value={''}>{'All'}</option>
                                {accountOptions}
                            </select>
                        </Label>
                    </div>
                    <Label>
                        {'Select tag(s)'}
                        <select
                            defaultValue={[].concat(query.tagId)}
                            multiple
                            name={'tagId'}
                            ref={tagsRef}
                            size={10}
                        >
                            <option value={''}>{'All'}</option>
                            <option value={0}>{'None'}</option>
                            {tagOptions}
                        </select>
                    </Label>
                </div>
                <ButtonGroup>
                    <Button type={'reset'}>
                        {'Reset'}
                    </Button>
                    <Button
                        shade={'primary'}
                        type={'submit'}
                    >
                        {'Apply'}
                    </Button>
                </ButtonGroup>
            </fieldset>
        </form>
    );
};
