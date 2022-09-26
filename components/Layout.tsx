import Head from 'next/head';
import Header from '@components/Header';
import Footer from './Footer';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
  disableSeo?: boolean;
};

const Layout = (props: LayoutProps) => {
  const { children, title = 'maore', disableSeo = false } = props;

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link rel="canonical" href="https://maore.io/" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="maore.io is a board game online website. Enjoy!!"
        />
        <meta property="og:title" content="maore" />
        <meta
          property="og:description"
          content="maore.io is a board game online website. Enjoy!!"
        />
        {!disableSeo && <meta name="robots" content="all" />}
      </Head>
      <Header />
      <main style={{ flex: '1 0 auto' }}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
