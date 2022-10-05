import {FunctionComponent, PropsWithChildren} from 'react';

export const Label: FunctionComponent<PropsWithChildren> = (props) => (
    <label
        style={{
            alignItems: 'start',
            display: 'flex',
            flexDirection: 'column',
            margin: '.5em'
        }}
    >
        {props.children}
    </label>
);
