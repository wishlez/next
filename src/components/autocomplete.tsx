import {go} from 'fuzzysort';
import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Label} from './label';

type Option<T> = T & {
    id: number;
}

type Props<T> = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    label: string,
    onOptionSelect: (option: T) => void
    optionRenderer: (option: T) => React.ReactElement
    optionSearchKeys: (keyof Option<T>)[]
    optionSelectedValueKey: keyof Option<T>
    options: Option<T>[]
};

const limitIncrement = (index: number, limit: number): number => index === limit ? limit : index + 1;
const limitDecrement = (index: number, limit: number): number => index === limit ? limit : index - 1;

const AutocompleteRenderer = <T, >(props: Props<T>, ref: React.ForwardedRef<HTMLInputElement>): React.ReactElement => {
    const {
        label,
        onInput,
        onKeyUp,
        onOptionSelect,
        optionRenderer,
        optionSearchKeys,
        optionSelectedValueKey,
        options,
        ...inputProps
    } = props;

    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [matchedOptions, setMatchedOptions] = useState<Option<T>[]>([]);
    const inputRef = useRef<HTMLInputElement>();
    const popupRef = useRef<HTMLUListElement>();

    const handleInput: React.FormEventHandler<HTMLInputElement> = (event) => {
        onInput?.(event);

        let searchResults: Option<T>[] = [];

        if (inputRef.current.value.length) {
            searchResults = go(inputRef.current.value, options, {key: optionSearchKeys.join('<::>').split('<::>')})
                .map(({obj}) => obj)
                .slice(0, 10);
        }

        setMatchedOptions(searchResults);

        if (searchResults.length) {
            setActiveIndex((index) => Math.min(index, searchResults.length));
        } else {
            setActiveIndex(0);
        }
    };

    const closePopup = (): void => {
        setMatchedOptions([]);
        setActiveIndex(0);
    };

    const applySelection = (index: number): void => {
        const matchedOption = matchedOptions[index];

        closePopup();
        onOptionSelect(matchedOption);
        inputRef.current.value = matchedOption[optionSelectedValueKey].toString();
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.code === 'ArrowDown') {
            event.preventDefault();

            setActiveIndex((index) => limitIncrement(index, matchedOptions.length - 1));
        } else if (event.code === 'ArrowUp') {
            event.preventDefault();

            setActiveIndex((index) => limitDecrement(index, 0));
        } else if (event.code === 'Enter' && matchedOptions.length) {
            event.preventDefault();

            applySelection(activeIndex);
        }

        onKeyUp?.(event);
    };

    useImperativeHandle(ref, () => inputRef.current);

    useEffect(() => {
        const clickHandler: EventListener = (event) => {
            if (popupRef.current !== event.target || popupRef.current.contains(event.target as HTMLElement)) {
                closePopup();
            }
        };

        window.addEventListener('click', clickHandler);

        return () => window.removeEventListener('click', clickHandler);
    }, []);

    return (
        <Label style={{position: 'relative'}}>
            {label}
            <input
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                {...inputProps}
            />
            <ul
                style={{
                    backgroundColor: 'white',
                    boxShadow: '0 0 2px rgba(0, 0, 0, .5)',
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    position: 'absolute',
                    top: '100%'
                }}
            >
                {matchedOptions.map((option, index) => (
                    <li
                        key={option.id}
                        onClick={(): void => applySelection(index)}
                        style={{
                            padding: '.5em',
                            ...index === activeIndex && {
                                backgroundColor: '#0000ee',
                                color: 'white'
                            }
                        }}
                    >
                        {optionRenderer(option)}
                    </li>
                ))}
            </ul>
        </Label>
    );
};

export const Autocomplete = React.forwardRef(AutocompleteRenderer) as
    <T>(props: Props<T> & React.RefAttributes<HTMLInputElement>) => React.ReactElement;
