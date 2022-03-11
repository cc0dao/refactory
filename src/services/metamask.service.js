import Web3 from 'web3';

export const isMetamaskInstalled = () => typeof window.ethereum !== 'undefined';

export const handleSignMessage = ({ publicAddress, signMsg }) => {
  console.log('window.web3: ', window.web3)
  return new Promise((resolve, reject) =>
    window.web3.eth.personal.sign(signMsg, publicAddress, (err, signature) => {
      if (err) return reject(err);
      return resolve({ publicAddress, signature });
    })
  );
};
