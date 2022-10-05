import {GetServerSideProps, GetServerSidePropsContext, PreviewData, Redirect} from 'next';
import {Session} from 'next-auth';
import {ParsedUrlQuery} from 'querystring';

type ShouldRedirect = (session: Session) => boolean;

type GetRedirect = (context: GetServerSidePropsContext) => Redirect

export type Auth = (shouldRedirect: ShouldRedirect, getRedirect: GetRedirect) =>
    <P, Q extends ParsedUrlQuery = ParsedUrlQuery, D extends PreviewData = PreviewData>(getServerSideProps?: GetServerSideProps<P, Q, D>) =>
        GetServerSideProps<P, Q, D>

export type Credentials = {
    login: string
    password: string
}
