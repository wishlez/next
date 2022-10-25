import {forwardRef, PropsWithChildren, useImperativeHandle, useRef} from 'react';
import {Dialog} from '../../types/dialog';

type Props = {
    buttonText: string
    onClose: () => void
};

export const TransactionsBulkEditDialog = forwardRef<Dialog, PropsWithChildren<Props>>((props, ref) => {
    const dialogRef = useRef<Dialog>();

    useImperativeHandle(ref, () => dialogRef.current);

    return (
        <>
            <button onClick={(): void => dialogRef.current.showModal()}>{props.buttonText}</button>
            <dialog
                onClose={props.onClose}
                ref={dialogRef}
            >
                <form method={'dialog'}>
                    {props.children}
                    <button value={'update'}>{'Update'}</button>
                    <button value={'cancel'}>
                        {'Cancel'}
                    </button>
                </form>
            </dialog>
        </>
    );
});

TransactionsBulkEditDialog.displayName = 'TransactionsBulkEditDialog';
