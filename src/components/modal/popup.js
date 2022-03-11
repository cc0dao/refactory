import React from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import clsx from "clsx"

function PopupModal(props) {
  const { open, handleClose, children } = props;
  console.log(open)


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      classes={{ paper: "bg-black outline rounded-lg border-2 border-black w-485" }}
    >
      <div style={{ backgroundColor: 'black' }}>
        <p className="text-right text-gray-50 absolute r-2 cursor-pointer" onClick={() => handleClose()}>x</p>
        <DialogContent className="mt-2">
            { children }
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default PopupModal;
