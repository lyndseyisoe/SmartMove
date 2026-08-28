import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from 'sonner';
import { router } from './app/router';
import { fetchCurrentUser, forceLogout } from './features/auth/authSlice';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(fetchCurrentUser());

    const handleUnauthorized = () => dispatch(forceLogout());
    window.addEventListener('smartmove:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('smartmove:unauthorized', handleUnauthorized);
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
        }}
      />
    </>
  );
}
