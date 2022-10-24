import {useRouter} from 'next/router';
import {FunctionComponent} from 'react';
import useSWR from 'swr';
import {getMonthOptions, getYearOptions} from '../../services/utils/date';
import {getOptions} from '../../services/utils/options';
import {swrKeys} from '../../services/utils/swr-keys';
import {WithAccounts} from '../../types/accounts';
import {WithTags} from '../../types/tags';
import {TransactionQuery} from '../../types/transactions';
import {Label} from '../label';

export const TransactionsFilterForm: FunctionComponent = () => {
    const router = useRouter();
    const query: TransactionQuery = router.query;
    const {data: accounts} = useSWR<WithAccounts>(swrKeys.accounts);
    const {data: tags} = useSWR<WithTags>(swrKeys.tags);

    const accountOptions = getOptions(accounts?.accounts, 'name', 'id');
    const tagOptions = getOptions(tags?.tags, 'name', 'id');

    return (
        <form method={'get'}>
            <fieldset>
                <legend>{'Search transactions'}</legend>
                <div
                    style={{
                        alignItems: 'end',
                        display: 'flex',
                        flexWrap: 'wrap'
                    }}
                >
                    <Label>
                        {'Enter description'}
                        <input
                            defaultValue={query.description}
                            name={'description'}
                            placeholder={'+made -payment'}
                            type={'text'}
                        />
                    </Label>
                    <Label>
                        {'Select a year'}
                        <select
                            defaultValue={query.year}
                            name={'year'}
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
                        >
                            <option value={''}>{'All'}</option>
                            {accountOptions}
                        </select>
                    </Label>
                    <Label>
                        {'Select tag(s)'}
                        <select
                            defaultValue={[].concat(query.tagId)}
                            multiple
                            name={'tagId'}
                        >
                            <option value={''}>{'All'}</option>
                            <option value={0}>{'None'}</option>
                            {tagOptions}
                        </select>
                    </Label>
                </div>
                <button type={'reset'}>
                    {'Reset'}
                </button>
                <button type={'submit'}>
                    {'Apply'}
                </button>
            </fieldset>
        </form>
    );
};
