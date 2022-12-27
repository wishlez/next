import {Link} from '@wishlez/ui';
import NextLink from 'next/link';
import {FunctionComponent, PropsWithChildren} from 'react';

type Props = PropsWithChildren<{
    href: string
}>;

export const NavLink: FunctionComponent<Props> = ({href, ...props}) => (
    <NextLink
        href={href}
        passHref
    >
        <Link {...props}>
            {props.children}
        </Link>
    </NextLink>
);
