import Layout from 'components/Layout';
import { useSelector } from 'react-redux';
import { roomSelector } from 'selectors/roomSelector';

const Rooms = () => {
  const room = useSelector(roomSelector);

  if (!room) return <div>Loading...</div>;

  return (
    <Layout>
      <div>{room.id}</div>
    </Layout>
  );
};

export default Rooms;
