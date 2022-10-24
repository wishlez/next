import 'material-symbols/rounded.css';
import {SessionProvider} from 'next-auth/react';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {FunctionComponent} from 'react';
import {PageProps} from '../types/page';
import './_app.css';

const App: FunctionComponent<AppProps<PageProps>> = ({Component, pageProps}) => {
    return (
        <>
            <Head>
                <title>
                    {`${pageProps.title ? `${pageProps.title} | ` : ''}Wishlez v${process.env.VERSION}`}
                </title>
            </Head>
            <SessionProvider session={pageProps.session}>
                <Component {...pageProps}/>
            </SessionProvider>
        </>
    );
};

export default App;
