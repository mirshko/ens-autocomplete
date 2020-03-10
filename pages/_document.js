import Document, { Head, Html, Main, NextScript } from "next/document";
import { FATHOM_SITE_ID } from "../lib/fathom";

export default class extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(f, a, t, h, o, m){
              a[h]=a[h]||function(){
              (a[h].q=a[h].q||[]).push(arguments)
              };
              o=f.createElement('script'),
              m=f.getElementsByTagName('script')[0];
              o.async=1; o.src=t; o.id='fathom-script';
              m.parentNode.insertBefore(o,m)
              })(document, window, 'https://cdn.usefathom.com/tracker.js', 'fathom');
              fathom('set', 'siteId', '${FATHOM_SITE_ID}');
              fathom('trackPageview');
          `
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
