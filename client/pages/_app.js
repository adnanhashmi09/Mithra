import '../styles/globals.css';

import { Toaster } from 'react-hot-toast';
import { StateContext } from '../context/stateContext';

function MyApp({ Component, pageProps }) {
  return (
    <StateContext>
      <Toaster />
      <Component {...pageProps} />
    </StateContext>
  );
}

export default MyApp;
