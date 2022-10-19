import Link from 'next/link';
import {FunctionComponent} from 'react';
import {Icon} from './icon';
import {NavContainer} from './nav-container';

export const Nav: FunctionComponent = () => (
    <NavContainer>
        <Link href={'/'}><Icon name={'home'}/></Link>
        <Link href={'/accounts'}>{'Accounts'}</Link>
        <Link href={'/tags'}>{'Tags'}</Link>
        <Link href={'/transactions'}>{'Transactions'}</Link>
        <span>{'|'}</span>
        <Link href={'/auth/sign-out'}>{'Sign Out'}</Link>
    </NavContainer>
);
