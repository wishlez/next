import {FunctionComponent, PropsWithChildren} from 'react';

export const NavContainer: FunctionComponent<PropsWithChildren> = (props) => (
    <nav
        style={{
            alignItems: 'baseline',
            display: 'flex',
            gap: '1em',
            listStyle: 'none',
            margin: '1em 0'
        }}
    >
        {props.children}
    </nav>
);
