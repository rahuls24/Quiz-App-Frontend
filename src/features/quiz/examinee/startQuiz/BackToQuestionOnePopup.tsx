import { setCurrentOngoingQuestionIndex } from '@Feature/quiz/QuizSlice';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch } from '@ReduxStore/hooks';
import {compose} from 'ramda';
import {Dispatch as ReactDispatch, SetStateAction as ReactSetStateAction} from 'react';

type BackToQuestionOnePopupProps = {
    open: boolean;
    setOpen: ReactDispatch<ReactSetStateAction<boolean>>;
};
export default function BackToQuestionOnePopup(
    props: BackToQuestionOnePopupProps
) {
    const { open, setOpen } = props;
    const dispatch = useAppDispatch();

    const handleAgree = () => {
        compose(dispatch, setCurrentOngoingQuestionIndex)(0);
        handleClose();
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {'Back to Question 1?'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    You have reached to the last question of this quiz. You can
                    go back to the first question or you can submit you answers.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>No</Button>
                <Button onClick={handleAgree} autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
}
