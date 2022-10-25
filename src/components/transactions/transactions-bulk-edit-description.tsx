import {FunctionComponent, useRef} from 'react';
import {doPut} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {Dialog} from '../../types/dialog';
import {Label} from '../label';

type Props = {
    ids: number[]
    onUpdate: () => void
}

export const TransactionsBulkEditDescription: FunctionComponent<Props> = (props) => {
    const dialogRef = useRef<Dialog>();
    const descriptionRef = useRef<HTMLInputElement>();

    const updateTransactions = async (): Promise<void> => {
        await doPut(swrKeys.transactionsEdit.description, {
            description: descriptionRef.current.value,
            ids: props.ids
        });
    };

    const handleClose = async (): Promise<void> => {
        if (dialogRef.current.returnValue === 'update' && descriptionRef.current.value) {
            await updateTransactions();

            descriptionRef.current.value = '';
            props.onUpdate();
        }
    };

    return (
        <>
            <button onClick={(): void => dialogRef.current.showModal()}>{'Description'}</button>
            <dialog
                onClose={handleClose}
                ref={dialogRef}
            >
                <Label>
                    {'Enter new description'}
                    <input
                        autoFocus
                        name={'description'}
                        placeholder={'New description'}
                        ref={descriptionRef}
                        type={'text'}
                    />
                </Label>
                <form method={'dialog'}>
                    <button value={'cancel'}>
                        {'Cancel'}
                    </button>
                    <button value={'update'}>{'Update'}</button>
                </form>
            </dialog>
        </>
    );
};
