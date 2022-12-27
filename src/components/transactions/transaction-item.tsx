import {ButtonGroup, IconButton, Link} from '@wishlez/ui';
import NextLink from 'next/link';
import {ChangeEvent, FunctionComponent} from 'react';
import {doDelete} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {WithTransaction} from '../../types/transactions';
import {Amount} from '../amount';

type Props = WithTransaction<{
    onChange: () => void
    selectable?: boolean
    isSelected?: boolean
    onSelect?: (event: ChangeEvent<HTMLInputElement>) => void
}>

export const TransactionItem: FunctionComponent<Props> = (props) => {
    const handleDelete = async (): Promise<void> => {
        const canDelete = confirm(`Do you want to delete ${props.transaction.description}?`);

        if (canDelete) {
            await doDelete(swrKeys.transactions, {id: props.transaction.id.toString()});
            await props.onChange();
        }
    };

    return (
        <tr>
            <td>
                {props.selectable && (
                    <input
                        checked={props.isSelected}
                        name={'id'}
                        onChange={props.onSelect}
                        type={'checkbox'}
                        value={props.transaction.id}
                    />
                )}
                {props.transaction.description}
            </td>
            <td>
                {props.transaction.FromAccount.name}
            </td>
            <td>
                {props.transaction.ToAccount.name}
            </td>
            <td>
                {props.transaction.date}
            </td>
            <td>
                {props.transaction.TransactionTag.map(({Tag}) => Tag.name).join(', ')}
            </td>
            <td style={{textAlign: 'right'}}>
                <Amount amount={props.transaction.amount}/>
            </td>
            <td>
                <ButtonGroup>
                    <NextLink href={`edit?id=${props.transaction.id}`}>
                        <IconButton
                            as={Link}
                            iconName={'edit'}
                            type={'button'}
                        />
                    </NextLink>
                    <IconButton
                        iconName={'delete'}
                        onClick={handleDelete}
                    />
                </ButtonGroup>
            </td>
        </tr>
    );
};
