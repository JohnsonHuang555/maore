import { reset } from 'actions/RoomAction';
import Router from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

type UseWarningOnExitProps = {
  shouldWarn: boolean;
  warningText?: string;
  createdRoomId?: string;
  leaveRoom?: () => void;
};

export const useWarningOnExit = ({
  shouldWarn,
  warningText,
  createdRoomId,
  leaveRoom,
}: UseWarningOnExitProps) => {
  const message = warningText || 'Are you sure that you want to leave?';
  const dispatch = useDispatch();

  useEffect(() => {
    let isWarned = false;

    const routeChangeStart = (url: string) => {
      if (Router.asPath !== url && shouldWarn && !isWarned) {
        isWarned = true;
        if (window.confirm(message)) {
          Router.push(url);
        } else {
          isWarned = false;
          Router.events.emit('routeChangeError');
          Router.replace(Router, Router.asPath, { shallow: true });
          throw 'Abort route change. Please ignore this error.';
        }
      }
    };

    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldWarn && !isWarned) {
        const event = e || window.event;
        event.returnValue = message;
        return message;
      }
      return null;
    };

    Router.events.on('routeChangeStart', routeChangeStart);
    window.addEventListener('beforeunload', beforeUnload);
    Router.beforePopState(({ url }) => {
      if (Router.asPath !== url && shouldWarn && !isWarned) {
        isWarned = true;
        if (window.confirm(message)) {
          return true;
        } else {
          isWarned = false;
          window.history.pushState(null, '', url);
          Router.replace(Router, Router.asPath, { shallow: true });
          return false;
        }
      }
      return true;
    });

    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
      window.removeEventListener('beforeunload', beforeUnload);

      if (leaveRoom) {
        console.log(123456);
        dispatch(leaveRoom());
      }

      if (createdRoomId) {
        dispatch(reset());
      }

      Router.beforePopState(() => {
        return true;
      });
    };
  }, [message, shouldWarn]);
};