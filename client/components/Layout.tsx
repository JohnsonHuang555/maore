import Head from 'next/head';
import Container from '@material-ui/core/Container';
import Header from 'components/Header';
import Footer from 'components/Footer';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const Layout = (props: LayoutProps) => {
  const { children, title = 'cookuya' } = props;

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Container maxWidth={false} style={{ flex: '1 0 auto' }}>
        <main
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: 'column',
          }}
        >
          {children}
        </main>
      </Container>
      <Footer />
    </>
  );
};

export default Layout;
