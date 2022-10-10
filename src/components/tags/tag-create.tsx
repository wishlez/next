import {FunctionComponent} from 'react';
import {doPost} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {TagRequest} from '../../types/tags';
import {TagForm} from './tag-form';

type Props = {
    onCreate: () => void
}

export const TagCreate: FunctionComponent<Props> = (props) => {
    const createTag = async (tag: TagRequest): Promise<void> => {
        await doPost(swrKeys.tags, tag);
        await props.onCreate();
    };

    return (
        <TagForm onSubmit={createTag}/>
    );
};
