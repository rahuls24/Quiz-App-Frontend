import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { AutoHideAlertProps } from '@Type/Quiz';
import React from 'react';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function AutoHideAlert(props: AutoHideAlertProps) {
    const {
        isOpen,
        onCloseHandler = () => {},
        alertMsg,
        severity,
        autoHideDuration,
    } = props;
    return (
        <Snackbar
            open={isOpen ? true : false}
            autoHideDuration={autoHideDuration}
            onClose={onCloseHandler}
        >
            <Alert
                severity={severity}
                sx={{ width: '100%' }}
                onClose={onCloseHandler}
            >
                {alertMsg}
            </Alert>
        </Snackbar>
    );
}

export default AutoHideAlert;
