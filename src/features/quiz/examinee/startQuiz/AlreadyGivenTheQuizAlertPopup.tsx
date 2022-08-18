import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';
type AlreadyGivenTheQuizAlertPopupProps = {
    open: boolean;
    onCloseHandler: (reason: string) => void;
};
function AlreadyGivenTheQuizAlertPopup(
    props: AlreadyGivenTheQuizAlertPopupProps
) {
    const { open, onCloseHandler } = props;
    const navigate = useNavigate();
    return (
        <Dialog
            open={open}
            onClose={(_event, reason) => onCloseHandler(reason)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            disableEscapeKeyDown
        >
            <DialogTitle id="alert-dialog-title">
                {'You are not allowed to open this Quiz'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    You have already given this Quiz. Please report this issue
                    if you have not given this quiz in past.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => navigate('/')} autoFocus>
                    Go Home
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AlreadyGivenTheQuizAlertPopup;
