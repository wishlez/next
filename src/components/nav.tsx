import {Icon} from '@wishlez/ui';
import {FunctionComponent} from 'react';
import {NavContainer} from './nav-container';
import {NavLink} from './nav-link';

export const Nav: FunctionComponent = () => (
    <NavContainer>
        <NavLink href={'/'}><Icon name={'home'}/></NavLink>
        <NavLink href={'/accounts'}>{'Accounts'}</NavLink>
        <NavLink href={'/tags'}>{'Tags'}</NavLink>
        <NavLink href={'/transactions'}>{'Transactions'}</NavLink>
        <span>{'|'}</span>
        <NavLink href={'/auth/sign-out'}>{'Sign Out'}</NavLink>
    </NavContainer>
);
