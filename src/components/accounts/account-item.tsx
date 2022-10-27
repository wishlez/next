import Link from 'next/link';
import {FunctionComponent} from 'react';
import {doDelete} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {WithAccount} from '../../types/accounts';
import {Icon} from '../icon';
import {AccountBalance} from './account-balance';

type Props = WithAccount<{
    onChange: () => void
}>

export const AccountItem: FunctionComponent<Props> = (props) => {
    const handleDelete = async (): Promise<void> => {
        const canDelete = confirm(`Do you want to delete ${props.account.name}?`);

        if (canDelete) {
            await doDelete(swrKeys.accounts, {id: props.account.id.toString()});
            await props.onChange();
        }
    };

    return (
        <tr>
            <td>
                <Link href={`/transactions/list?accountId=${props.account.id}`}>{props.account.name}</Link>
            </td>
            <td>
                {props.account.accountType}
            </td>
            <td style={{textAlign: 'right'}}>
                {!props.account.builtIn && (
                    <AccountBalance
                        accountId={props.account.id}
                        openingBalance={props.account.openingBalance}
                    />
                )}
            </td>
            <td>
                {props.account.builtIn ? (
                    <Icon name={'lock'}/>
                ) : (
                    <>
                        <Link href={`edit?id=${props.account.id}`}>
                            <button type={'button'}>
                                <Icon name={'edit'}/>
                            </button>
                        </Link>
                        <button
                            onClick={handleDelete}
                            type={'button'}
                        >
                            <Icon name={'delete'}/>
                        </button>
                    </>
                )}
            </td>
        </tr>
    );
};
