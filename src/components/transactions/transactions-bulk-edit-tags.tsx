import {FunctionComponent, useRef} from 'react';
import useSWR from 'swr';
import {doPatch} from '../../services/utils/fetch';
import {getOptions, getSelectedOptions} from '../../services/utils/options';
import {swrKeys} from '../../services/utils/swr-keys';
import {Dialog} from '../../types/dialog';
import {WithTags} from '../../types/tags';
import {Label} from '../label';
import {TransactionsBulkEditDialog} from './transactions-bulk-edit-dialog';

type Props = {
    ids: number[]
    onUpdate: () => void
    type: 'add' | 'delete'
}

export const TransactionsBulkEditTag: FunctionComponent<Props> = (props) => {
    const dialogRef = useRef<Dialog>();
    const tagsRef = useRef<HTMLSelectElement>();
    const {data: tags} = useSWR<WithTags>(swrKeys.tags);

    const tagOptions = getOptions(tags?.tags, 'name', 'id');

    const updateTransactions = async (): Promise<void> => {
        const tagIds = getSelectedOptions(tagsRef.current);

        await doPatch(swrKeys.transactionsTags, {
            ids: props.ids,
            tags: {
                added: props.type === 'add' ? tagIds : [],
                deleted: props.type === 'delete' ? tagIds : []
            }
        });
    };

    const handleClose = async (): Promise<void> => {
        if (dialogRef.current.returnValue === 'update' && tagsRef.current.value) {
            await updateTransactions();

            tagsRef.current.value = '';
            props.onUpdate();
        }
    };

    return (
        <TransactionsBulkEditDialog
            buttonText={`Tag ${props.type}`}
            onClose={handleClose}
            ref={dialogRef}
        >
            <Label>
                {`Select tags to ${props.type}`}
                <select
                    autoFocus
                    multiple
                    name={'tagId'}
                    ref={tagsRef}
                    size={10}
                >
                    {tagOptions}
                </select>
            </Label>
        </TransactionsBulkEditDialog>
    );
};
