import Head from 'next/head';
import Header from '@components/Header';
import Footer from './Footer';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const Layout = (props: LayoutProps) => {
  const { children, title = 'maore' } = props;

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <Header />
      <main style={{ flex: '1 0 auto' }}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
