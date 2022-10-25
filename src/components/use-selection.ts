import {ChangeEvent, MutableRefObject, useEffect, useRef} from 'react';
import {WithId} from '../types/id';

type Props<T> = {
    selected: number[],
    all: T[],
    onSelectionChange: (ids: number[]) => void
};

type UseSelection = <T extends WithId>(props: Props<T>) => {
    handleSelectOne: (event: ChangeEvent<HTMLInputElement>) => void
    handleSelectAll: (event: ChangeEvent<HTMLInputElement>) => void
    selectAllRef: MutableRefObject<HTMLInputElement>
}

export const useSelection: UseSelection = (props) => {
    const selectAllRef = useRef<HTMLInputElement>();

    const handleSelectOne = (event: ChangeEvent<HTMLInputElement>): void => {
        const id = Number(event.target.value);
        let selected: number[];

        if (event.target.checked) {
            selected = props.selected?.concat(id);
        } else {
            selected = props.selected?.filter((value) => value !== id);
        }

        props.onSelectionChange?.(selected);
    };

    const handleSelectAll = (event: ChangeEvent<HTMLInputElement>): void => {
        let selected: number[] = [];

        if (event.target.checked) {
            selected = props.all?.map(({id}: WithId) => id);
        }

        props.onSelectionChange?.(selected);
    };

    useEffect(() => {
        if (!props.all?.length || !selectAllRef.current) {
            return;
        }

        if (props.selected?.length === props.all?.length) {
            selectAllRef.current.checked = true;
            selectAllRef.current.indeterminate = false;
        } else if (props.selected?.length === 0) {
            selectAllRef.current.checked = false;
            selectAllRef.current.indeterminate = false;
        } else {
            selectAllRef.current.checked = false;
            selectAllRef.current.indeterminate = true;
        }
    }, [props.selected?.length, props.all?.length]);

    return {
        handleSelectAll,
        handleSelectOne,
        selectAllRef
    };
};
