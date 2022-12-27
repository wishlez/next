import {ButtonGroup, Icon, IconButton, Link} from '@wishlez/ui';
import NextLink from 'next/link';
import {FunctionComponent} from 'react';
import {doDelete} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {Account, WithAccount} from '../../types/accounts';
import {AccountBalance} from './account-balance';

type Props = WithAccount<{
    onChange: () => void
}>

const canShowBalance = (account: Account): boolean => !account.builtIn && account.accountType !== 'Revenue';

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
                {props.account.builtIn ? props.account.name : (
                    <NextLink href={`/transactions/list?accountId=${props.account.id}`}>{props.account.name}</NextLink>
                )}
            </td>
            <td>
                {props.account.accountType}
            </td>
            <td style={{textAlign: 'right'}}>
                {canShowBalance(props.account) && <AccountBalance {...props.account}/>}
            </td>
            <td>
                {props.account.builtIn ? (
                    <Icon name={'lock'}/>
                ) : (
                    <ButtonGroup>
                        <NextLink href={`edit?id=${props.account.id}`}>
                            <IconButton
                                as={Link}
                                iconName={'edit'}
                            />
                        </NextLink>
                        <IconButton
                            iconName={'delete'}
                            onClick={handleDelete}
                        />
                    </ButtonGroup>
                )}
            </td>
        </tr>
    );
};
