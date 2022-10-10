import {FunctionComponent} from 'react';
import useSWR, {useSWRConfig} from 'swr';
import {doGet} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {Tag, WithTags} from '../../types/tags';
import {TagCreate} from './tag-create';
import {TagItem} from './tag-item';

export const TagsList: FunctionComponent = () => {
    const {data, error} = useSWR<WithTags>(swrKeys.tags, doGet);
    const {mutate} = useSWRConfig();

    const refresh = async (): Promise<void> => {
        await mutate(swrKeys.tags);
    };

    return (
        <>
            {error && 'Failed to load tags'}
            {'Add new:'}
            <TagCreate onCreate={refresh}/>
            <ul>
                {data?.tags.map((tag: Tag) => (
                    <TagItem
                        key={tag.name}
                        onChange={refresh}
                        tag={tag}
                    />
                ))}
            </ul>
        </>
    );
};
