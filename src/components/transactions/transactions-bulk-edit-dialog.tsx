import {Button, ButtonGroup} from '@wishlez/ui';
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
            <Button onClick={(): void => dialogRef.current.showModal()}>{props.buttonText}</Button>
            <dialog
                onClose={props.onClose}
                ref={dialogRef}
            >
                <form method={'dialog'}>
                    {props.children}
                    <ButtonGroup>
                        <Button
                            type={'submit'}
                            value={'cancel'}
                        >
                            {'Cancel'}
                        </Button>
                        <Button
                            shade={'primary'}
                            type={'submit'}
                            value={'update'}
                        >
                            {'Update'}
                        </Button>
                    </ButtonGroup>
                </form>
            </dialog>
        </>
    );
});

TransactionsBulkEditDialog.displayName = 'TransactionsBulkEditDialog';
