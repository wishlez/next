import {FunctionComponent, HTMLAttributes} from 'react';

export const Label: FunctionComponent<HTMLAttributes<HTMLLabelElement>> = ({style, ...props}) => (
    <label
        style={{
            alignItems: 'start',
            display: 'flex',
            flexDirection: 'column',
            margin: '.5em',
            ...style
        }}
        {...props}
    />
);
