import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionsDetailsTable from './QuestionsDetailsTable';
type BackToQuestionOnePopupProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    quizSubmitHandler: () => Promise<boolean>;
};
export default function SubmitQuizPopup(props: BackToQuestionOnePopupProps) {
    const { open, setOpen, quizSubmitHandler } = props;
    let navigate = useNavigate();
    const handleSubmit = async () => {
        const isSubmitted = await quizSubmitHandler();
        setOpen(false);
        if (isSubmitted) navigate('/quiz/result');
        else {
        }
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
            fullWidth={true}
            maxWidth={'md'}
        >
            <DialogTitle id="alert-dialog-title">{'Submit Quiz'}</DialogTitle>
            <DialogContent>
                <QuestionsDetailsTable />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Back</Button>
                <Button onClick={handleSubmit} autoFocus>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}
