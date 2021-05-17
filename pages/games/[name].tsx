import Layout from 'components/Layout';
import { Game } from 'domain/models/Game';
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

const Games = () => {
  const { query } = useRouter();

  const { data: game, error } = useSWR<Game, Error>(
    () => query.name && `/api/game/${query.name}`,
    fetcher
  );

  if (error) return <div>{error.message}</div>;
  if (!game) return <div>Loading...</div>;

  return (
    <Layout>
      <h2 className="title">{game.name}</h2>
    </Layout>
  );
};

export default Games;
