import Link from 'next/link';
import {FunctionComponent} from 'react';
import {doDelete} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {WithTransaction} from '../../types/transactions';
import {Amount} from '../amount';
import {Icon} from '../icon';

type Props = WithTransaction<{
    onChange: () => void
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
                <Link href={`edit?id=${props.transaction.id}`}>
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
            </td>
        </tr>
    );
};
