// useIdleTimer.js
<<<<<<< HEAD
import { useEffect, useRef } from 'react';

const useIdleTimer = (onIdle, timeout = 300000) => { // 300000 ms = 5 minutos
  const timerRef = useRef(null);
=======
import { useEffect, useRef, useState } from 'react';

const useIdleTimer = (onIdle, timeout = 30 * 60 * 1000) => { // 30 minutos por padrão
  const timerRef = useRef(null);
  const [isIdle, setIsIdle] = useState(false);
>>>>>>> e62255e (Atualizações no projeto)

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
<<<<<<< HEAD
    timerRef.current = setTimeout(onIdle, timeout);
=======
    
    setIsIdle(false);
    
    timerRef.current = setTimeout(() => {
      setIsIdle(true);
      onIdle();
    }, timeout);
>>>>>>> e62255e (Atualizações no projeto)
  };

  useEffect(() => {
    const handleActivity = () => {
<<<<<<< HEAD
      resetTimer();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('click', handleActivity);

    resetTimer();

    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [onIdle, timeout]);

  return null;
};

export default useIdleTimer;
=======
      if (isIdle) {
        console.log('👤 Usuário voltou a ser ativo');
      }
      resetTimer();
    };

    const events = [
      'mousemove',
      'keydown',
      'scroll',
      'click',
      'touchstart',
      'touchmove',
      'focus',
      'blur'
    ];

    // Adiciona listeners para todos os eventos
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Inicia o timer
    resetTimer();

    // Cleanup
    return () => {
      clearTimeout(timerRef.current);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [onIdle, timeout, isIdle]);

  return { isIdle, resetTimer };
};

export default useIdleTimer;
>>>>>>> e62255e (Atualizações no projeto)
