import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
type ConfirmQuizPopupProps = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onConfirmHandler: () => Promise<void>;
};
export default function ConfirmQuizPopup(props: ConfirmQuizPopupProps) {
	const { open, setOpen, onConfirmHandler } = props;
	const handleClose = () => {
		setOpen(false);
	};
	return (
		<>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Save Quiz</DialogTitle>

				<DialogContent>
					<Typography variant='subtitle1'>
						You have to save the quiz name and topics before add
						question to it.
					</Typography>

					<Typography variant='subtitle2' color={'error'}>
						You can't able to edit quiz name and topics once you
						confirm this.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} sx={{ color: '#000000' }}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							onConfirmHandler();
							setOpen(false);
						}}
						color='success'
					>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
