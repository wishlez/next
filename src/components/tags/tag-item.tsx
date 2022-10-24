import Link from 'next/link';
import {FunctionComponent, useState} from 'react';
import {doDelete} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {WithTag} from '../../types/tags';
import {Icon} from '../icon';
import {TagUpdate} from './tag-update';

type Props = WithTag<{
    onChange: () => void
}>;

export const TagItem: FunctionComponent<Props> = (props) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = async (): Promise<void> => {
        const canDelete = confirm(`Do you want to delete ${props.tag.name}?`);

        if (canDelete) {
            await doDelete(swrKeys.tags, {id: props.tag.id.toString()});
            await props.onChange();
        }
    };

    const startEditing = (): void => setIsEditing(true);
    const stopEditing = (): void => setIsEditing(false);

    const handleUpdate = (): void => {
        stopEditing();
        props.onChange();
    };

    return (
        <li>
            {isEditing ? (
                <TagUpdate
                    onCancel={stopEditing}
                    onUpdate={handleUpdate}
                    tag={props.tag}
                />
            ) : (
                <>
                    <Link href={`/transactions/list?tagId=${props.tag.id}`}>{props.tag.name}</Link>
                    {'\u00A0'}
                    <button
                        onClick={startEditing}
                        type={'button'}
                    >
                        <Icon name={'edit'}/>
                    </button>
                    <button
                        onClick={handleDelete}
                        type={'button'}
                    >
                        <Icon name={'delete'}/>
                    </button>
                </>
            )}
        </li>
    );
};
