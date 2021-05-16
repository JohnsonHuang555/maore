import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

const Game = () => {
  const { query } = useRouter();
  const { data, error } = useSWR(
    () => query.name && `/api/game/${query.name}`,
    fetcher
  );

  if (error) return <div>{error.message}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Layout>
      <h2 className="title">推薦遊戲</h2>
    </Layout>
  );
};

export default Game;
