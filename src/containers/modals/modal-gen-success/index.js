import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Button from '@components/Button';
import Modal from '@components/modal';
import Loader from '@components/loader';
import Router from 'next/router';

import { closeSuccessModal } from '@actions/modals.actions';
import { getModalParams } from '@selectors/modal.selectors';

import styles from './styles.module.scss';
import { useSignMessage, useUserNameAvailable, useMyIP } from '@hooks/espa/user.hooks';

const ModalSignUp = ({ className, title }) => {
  const dispatch = useDispatch();
  const params = useSelector(getModalParams);

  const handleClose = () => {
    dispatch(closeSuccessModal());
    Router.push('/closeaccount');
  };

  return (
    <>
      {createPortal(
        <Modal
          onClose={() => handleClose()}
          title="META ID GENERATED!"
          className={(className, styles.modalWrapper)}
        >
          <div className={styles.currentAddress}>
            You have successfully entered the realm.
          </div>
          
        </Modal>,
        document.body
      )}
    </>
  );
};

ModalSignUp.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
};

ModalSignUp.defaultProps = {
  className: '',
  title: 'CONNECTING WALLET',
};

export default ModalSignUp;
