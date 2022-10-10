import {FormEvent, FunctionComponent, useRef} from 'react';
import {Tag, TagRequest} from '../../types/tags';

type Props = {
    onCancel?: () => void
    onSubmit: (tag: TagRequest) => void
    tag?: Tag
}

export const TagForm: FunctionComponent<Props> = (props) => {
    const nameRef = useRef<HTMLInputElement>();

    const setValidation = (message = ''): void => {
        nameRef.current.setCustomValidity(message);
        nameRef.current.reportValidity();
    };

    const submitTag = async (event: FormEvent): Promise<void> => {
        event.preventDefault();

        try {
            await props.onSubmit({
                name: nameRef.current.value
            });

            if (!props.tag) {
                nameRef.current.value = '';
                nameRef.current.focus();
            }
        } catch (e) {
            setValidation('Already exists or invalid value provided');
        }
    };

    const clearValidationMessage = (): void => {
        if (!nameRef.current.reportValidity()) {
            setValidation();
        }
    };

    return (
        <form
            onReset={props.onCancel}
            onSubmit={submitTag}
        >
            <label>
                <input
                    autoFocus
                    defaultValue={props.tag?.name}
                    onInput={clearValidationMessage}
                    placeholder={'Enter tag name'}
                    ref={nameRef}
                    required
                    type={'text'}
                />
            </label>
            <button type={'reset'}>
                {'Cancel'}
            </button>
            <button type={'submit'}>
                {props.tag ? 'Update' : 'Create'}
            </button>
        </form>
    );
};
