import {FunctionComponent} from 'react';
import {doPut} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {TagRequest, WithTag} from '../../types/tags';
import {TagForm} from './tag-form';

type Props = WithTag<{
    onCancel: () => void
    onUpdate: () => void
}>

export const TagUpdate: FunctionComponent<Props> = (props) => {
    const saveTag = async (tag: TagRequest): Promise<void> => {
        await doPut(swrKeys.tags, {
            ...props.tag,
            ...tag
        });
        await props.onUpdate();
    };

    return (
        <TagForm
            onCancel={props.onCancel}
            onSubmit={saveTag}
            tag={props.tag}
        />
    );
};
