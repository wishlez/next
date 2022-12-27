import {ButtonGroup, IconButton} from '@wishlez/ui';
import {FunctionComponent, useState} from 'react';
import {doDelete} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {WithTag} from '../../types/tags';
import {NavLink} from '../nav-link';
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
                    <NavLink href={`/transactions/search?tagId=${props.tag.id}`}>{props.tag.name}</NavLink>
                    {'\u00A0'}
                    <ButtonGroup>
                        <IconButton
                            iconName={'edit'}
                            onClick={startEditing}
                        />
                        <IconButton
                            iconName={'delete'}
                            onClick={handleDelete}
                        />
                    </ButtonGroup>
                </>
            )}
        </li>
    );
};
