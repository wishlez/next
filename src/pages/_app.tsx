import {SessionProvider} from 'next-auth/react';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {FunctionComponent} from 'react';
import {PageProps} from '../types/page';

const App: FunctionComponent<AppProps<PageProps>> = ({Component, pageProps}) => {
    return (
        <>
            <Head>
                <title>
                    {`${pageProps.title ? `${pageProps.title} | ` : ''}Wishlez v${process.env.VERSION}`}
                </title>
            </Head>
            <SessionProvider session={pageProps.session}>
                <div>{pageProps.session?.user && <a href={'/auth/sign-out'}>{'Sign Out'}</a>}</div>
                <Component {...pageProps}/>
            </SessionProvider>
        </>
    );
};

export default App;
