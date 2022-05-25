import { reset } from '@actions/roomAction';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

type UseWarningOnExitProps = {
  shouldWarn: boolean;
  warningText?: string;
  leaveRoom?: () => void;
};

export const useWarningOnExit = ({
  shouldWarn,
  warningText,
  leaveRoom,
}: UseWarningOnExitProps) => {
  const message = warningText || 'Are you sure that you want to leave?';
  const dispatch = useDispatch();

  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldWarn) {
        const event = e || window.event;
        event.returnValue = message;
        return message;
      }
      return null;
    };

    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      window.removeEventListener('beforeunload', beforeUnload);

      if (leaveRoom) {
        dispatch(leaveRoom());
      }
      dispatch(reset());
    };
  }, [message, shouldWarn]);
};
