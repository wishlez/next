import React, {ReactElement} from 'react';
import {Transaction} from '../../types/transactions';
import {Autocomplete} from '../autocomplete';

type Props = {
    transaction?: Transaction
    autocompleteOptions: Transaction[]
    onAutocomplete: (transaction: Transaction) => void
}

export const TransactionDescriptionInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
    return (
        <Autocomplete<Transaction>
            autoFocus
            defaultValue={props.transaction?.description}
            label={'Description'}
            name={'description'}
            onOptionSelect={props.onAutocomplete}
            optionRenderer={(transaction): ReactElement => (
                <>
                    <div>{transaction.description}</div>
                    <div>{transaction.TransactionTag.map(({Tag}) => Tag.name).join(', ')}</div>
                </>
            )}
            optionSearchKeys={['description']}
            optionSelectedValueKey={'description'}
            options={props.autocompleteOptions}
            placeholder={'Describe transaction'}
            ref={ref}
            required
            type={'text'}
        />
    );
});

TransactionDescriptionInput.displayName = 'TransactionDescriptionInput';
