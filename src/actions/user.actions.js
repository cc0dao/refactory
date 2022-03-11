import {
  closeConnectMetamaskModal,
  closeSignupModal,
  openNotInstalledMetamask,
  openSignupModal,
} from '@actions/modals.actions';
import globalActions from '@actions/global.new.actions';
import {
  STORAGE_IS_LOGGED_IN,
  STORAGE_USER,
  STORAGE_TOKEN,
  STORAGE_WALLET,
} from '@constants/storage.constants';
import { WALLET_METAMASK, WALLET_ARKANE } from '@constants/global.constants';
import userReducer from '@reducers/user.reducer';
import { handleSignMessage, isMetamaskInstalled } from '@services/metamask.service';
import { setWeb3Provider } from '@services/web3-provider.service';
import { getUser, getAuthToken } from '@helpers/user.helpers';
import BaseActions from './base-actions';
import api from '@services/api/espa/api.service';
import { toast } from 'react-toastify';
import Router from 'next/router';
import { openSuccessModal } from '@actions/modals.actions';
import config from '@utils/config';
import { getAccessControlContract } from '@services/contract.service';

class UserActions extends BaseActions {
  handleArkaneWeb3Load() {
    return async (dispatch) => {
      try {
        const chainId = await window.web3.eth.getChainId();
        const authResult = await Arkane.checkAuthenticated();
        const {
          auth: {
            idTokenParsed: { email },
          },
        } = authResult;
        const wallets = await window.web3.eth.getAccounts();
        localStorage.setItem(STORAGE_IS_LOGGED_IN, 1);
        localStorage.setItem('account', wallets[0]);
        dispatch(this.setValue('account', wallets[0]));
        dispatch(closeConnectMetamaskModal());
        dispatch(openSignupModal({ email }));
        dispatch(globalActions.changeNetwork('0x' + chainId.toString(16)));
        // dispatch(globalActions.setContractParams());
      } catch (e) {
        toast.error('Wallet Connect is failed');
      }
    };
  }

  tryToLogin(source) {
    return async (dispatch) => {
      localStorage.setItem(STORAGE_WALLET, source);
      await setWeb3Provider();
      if (source === WALLET_METAMASK) {
        if (!isMetamaskInstalled()) {
          dispatch(openNotInstalledMetamask());
          console.log('METAMASK WAS NOT DETECTED ON TRY TO LOGIN');
          return;
        }

        const { ethereum } = window;

        try {
          const [account] = await ethereum.request({
            method: 'eth_requestAccounts',
          });

          if (!account) {
            console.error('Account is epmty.');
            return;
          }

          localStorage.setItem(STORAGE_IS_LOGGED_IN, 1);
          localStorage.setItem('account', account);
          dispatch(this.setValue('account', account));
          dispatch(closeConnectMetamaskModal());
          dispatch(openSignupModal());
          dispatch(globalActions.initApp());
        } catch (e) {
          console.error(e.message);
        }
      } else if (source === WALLET_ARKANE) {
        dispatch(this.handleArkaneWeb3Load());
      }
    };
  }

  tryToSignup(account, userName, email, signMsg, ip) {
    return async (dispatch) => {
      dispatch(this.setValue('isLoading', true));
      console.log('-------------- here 1 ----------');
      var isSignup = false;

      if (!signMsg) {
        isSignup = true;
        signMsg = await api.handleSignUp(account, userName, email, ip);
        if (!signMsg) {
          toast.error('Sign Up is failed');
          dispatch(this.setValue('isLoading', false));
          return;
        }
      }

      try {
        console.log('-------------- before handleSignMessage ----------');
        const { signature } = await handleSignMessage({
          publicAddress: account,
          signMsg,
        });
        console.log('-------------- after handleSignMessage ----------');
        dispatch(this.tryAuthentication(account, signMsg, signature, isSignup));
      } catch (e) {
        dispatch(this.setValue('isLoading', false));
        console.log('error: ', e);
      }
    };
  }

  tryAuthentication(account, signMsg, signature, isSignup) {
    return async (dispatch) => {
      try {
        console.log('account: ', account);
        console.log('signMsg: ', signMsg);
        console.log('signature: ', signature);

        const data = await api.handleAuthentication(account, signMsg, signature);
        if (data) {
          const { returnData, secret } = data;
          dispatch(this.setValue('user', returnData));
          localStorage.setItem(STORAGE_IS_LOGGED_IN, 1);
          localStorage.setItem(STORAGE_USER, JSON.stringify(returnData));
          localStorage.setItem(STORAGE_TOKEN, secret);

          console.log('signin');
          // Router.push('/');
        } else {
          dispatch(this.logout());
        }
      } catch (e) {
        console.error(e.message);
        dispatch(this.logout());
      }
      console.log('signup');
      if (isSignup) {
        dispatch(this.logout());
        dispatch(openSuccessModal());
      } else {
        // Router.push('/');
      }

      dispatch(closeSignupModal());
      dispatch(this.setValue('isLoading', false));
    };
  }

  logout() {
    return async (dispatch) => {
      dispatch(this.setValue('user', null));
      localStorage.removeItem(STORAGE_IS_LOGGED_IN);
      localStorage.removeItem(STORAGE_USER);
      localStorage.removeItem(STORAGE_TOKEN);
      localStorage.removeItem('account');
      Router.push('/');
    };
  }

  updateProfile(user) {
    return async (dispatch) => {
      try {
        dispatch(this.setValue('isLoading', true));
        const isProfanity = await api.checkProfanity(user.username);
        if (isProfanity) {
          toast(
            'We detected profanity in the username, please input a different one. If you believe this is a mistake, please get in touch with on our support channels'
          );
          dispatch(this.setValue('isLoading', false));
          return;
        }
        const data = await api.updateProfile(user);
        if (data) {
          dispatch(this.setValue('user', data));
          localStorage.setItem(STORAGE_USER, JSON.stringify(data));
          toast('Profile is updated');
        } else {
        }
      } catch (e) {}
      dispatch(this.setValue('isLoading', false));
    };
  }

  checkStorageAuth() {
    return async (dispatch) => {
      const user = getUser();
      const token = getAuthToken();
      if (!user || !token) {
        return;
      }
      await setWeb3Provider();
      dispatch(this.setValue('account', localStorage.getItem('account')));
      dispatch(this.setValue('user', user));
    };
  }

  async checkWhitelisted(account) {
    const accessControlContractAddress = config.ACCESS_CONTROL_ADDRESSES;
    const contract = await getAccessControlContract(accessControlContractAddress);
    if (!contract) return;
    try {
      const res = await contract.methods.hasVerifiedMinterRole(account).call({ from: account });
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  uploadAvatar(file) {
    return async (dispatch) => {
      try {
        dispatch(this.setValue('isLoading', true));
        let url = await api.getPresignedUrl();
        if (url) {
          const result = await api.uploadImageToS3(url, file);
          if (result) {
            const user = getUser();
            const queryIndex = url.indexOf('?');
            if (queryIndex >= 0) {
              url = url.slice(0, queryIndex);
            }
            user.avatar = url;
            dispatch(this.updateProfile(user));
          }
        }
      } catch (e) {}
      dispatch(this.setValue('isLoading', false));
    };
  }
}

export default new UserActions(userReducer);
