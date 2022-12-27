import Document, {DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript} from 'next/document';
import {ServerStyleSheet} from 'styled-components';

export default class _Document extends Document {
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = (): DocumentInitialProps | Promise<DocumentInitialProps> =>
                originalRenderPage({
                    enhanceApp: (App) =>
                        (props) =>
                            sheet.collectStyles(<App {...props} />)
                });

            const initialProps = await Document.getInitialProps(ctx);

            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                )
            };
        } finally {
            sheet.seal();
        }
    }

    render(): JSX.Element {
        return (
            <Html>
                <Head/>
                <body>
                    <Main/>
                    <section id={'portal'}/>
                    <NextScript/>
                </body>
            </Html>
        );
    }
}
