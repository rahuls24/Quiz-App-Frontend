import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref,
) {
	return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});
function AutoHideAlert(props: IAutoHideAlert) {
	const { isOpen, onCloseHandler = () => {}, alertMsg, severity,autoHideDuration } = props;
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
// isOpen, onCloseHandler, alertMsg, severity
interface IAutoHideAlert {
	isOpen: boolean;
	onCloseHandler?: any;
	alertMsg: string;
	severity: 'error' | 'warning' | 'success';
	autoHideDuration: number;
}
