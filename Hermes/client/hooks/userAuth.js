import { useContext, useEffect } from 'react';
import { useStateContext } from '../context/StateContext';

const useAuthUser = () => {
  const { address } = useStateContext();

  useEffect(() => {
    async function authenticate() {
      try {
        const { nonce } = await (
          await fetch(`http://localhost:5050/user/nonce/${walletAddress}`)
        ).json();
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [nonce, address],
        });

        const authObject = { address, signature };

        fetch(`http://localhost:5050/auth/${address}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(authObject),
        })
          .then((response) => response.json())
          .then((resp) => {
            console.log(resp);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    }

    authenticate();
  }, [address]);
};

export default useAuthUser;
