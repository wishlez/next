import {FunctionComponent, PropsWithChildren} from 'react';
import {Nav} from './nav';

export const Layout: FunctionComponent<PropsWithChildren> = (props) => (
    <>
        <Nav/>
        {props.children}
    </>
);
