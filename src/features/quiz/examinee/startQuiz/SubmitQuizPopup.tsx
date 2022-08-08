import LoadingButton from '@mui/lab/LoadingButton';
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
    const [isSubmitBtnLoading, setIsSubmitBtnLoading] = React.useState(false);
    let navigate = useNavigate();
    const handleSubmit = async () => {
        setIsSubmitBtnLoading(true);
        const isSubmitted = await quizSubmitHandler();
        setOpen(false);
        if (isSubmitted) navigate('/quiz/result');
        setIsSubmitBtnLoading(false);
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
            <DialogTitle id="alert-dialog-title">
                {'Do you want to Submit?'}
            </DialogTitle>
            <DialogContent>
                <QuestionsDetailsTable />
            </DialogContent>
            <DialogActions sx={{ marginRight: 3 }}>
                <Button onClick={handleClose} variant="outlined">
                    Back
                </Button>
                <LoadingButton
                    onClick={handleSubmit}
                    loading={isSubmitBtnLoading}
                    variant="outlined"
                >
                    Submit
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
