import { RoomMessage } from "@domain/models/Message";
import { Button } from "@mui/material";
import { clientRoomSelector } from "@selectors/serverSelector";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const MathFormulaCard = () => {
  const clientRoom = useSelector(clientRoomSelector);

  useEffect(() => {
    if (clientRoom) {
      clientRoom.state.onChange = (changes) => {
        console.log(changes);
      }
    }
  }, [])

  const createGame = () => {
    clientRoom?.send(RoomMessage.CreateGame);
  }

  return (
    <div>
      <Button onClick={createGame}>
        1234
      </Button>
    </div>
  )
}

export default MathFormulaCard;
