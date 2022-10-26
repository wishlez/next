import {FunctionComponent} from 'react';
import {NavContainer} from '../nav-container';
import {TransactionsBulkEditAccount} from './transactions-bulk-edit-account';
import {TransactionsBulkEditDescription} from './transactions-bulk-edit-description';
import {TransactionsBulkEditTag} from './transactions-bulk-edit-tags';

type Props = {
    ids: number[]
    onUpdate: () => void
};

export const TransactionsBulkEditControls: FunctionComponent<Props> = (props) => (
    <NavContainer>
        <span style={{paddingLeft: '1.5em'}}>{'\u21B1 With selected, update:'}</span>
        <TransactionsBulkEditDescription
            ids={props.ids}
            onUpdate={props.onUpdate}
        />
        <TransactionsBulkEditAccount
            ids={props.ids}
            onUpdate={props.onUpdate}
            type={'from'}
        />
        <TransactionsBulkEditAccount
            ids={props.ids}
            onUpdate={props.onUpdate}
            type={'to'}
        />
        <TransactionsBulkEditTag
            ids={props.ids}
            onUpdate={props.onUpdate}
            type={'add'}
        />
        <TransactionsBulkEditTag
            ids={props.ids}
            onUpdate={props.onUpdate}
            type={'delete'}
        />
    </NavContainer>
);
