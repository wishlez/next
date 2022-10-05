import {forwardRef} from 'react';

type Props = {
    name: string
};

export const Icon = forwardRef<HTMLSpanElement, Props>((props, ref) => (
    <i
        className={'material-symbols-rounded'}
        ref={ref}
        style={{
            fontSize: '1.25em',
            verticalAlign: 'bottom'
        }}
    >
        {props.name}
    </i>
));

Icon.displayName = 'Icon';
