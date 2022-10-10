import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import * as React from 'react';
export default function FormDialog() {
    const [open, setOpen] = React.useState(true);
    const [role, setRole] = React.useState('examiner');
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Role</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ marginBottom: 2 }}>
                    <span>
                        If you want to give <em>quizzes</em>, please select
                        <b>
                            <em>examinee</em>
                        </b>{' '}
                        role and if you are here for making some
                        <em>quizzes</em> then please select{' '}
                        <b>
                            <em>examiner</em>
                        </b>{' '}
                        role.
                    </span>
                </DialogContentText>
                <FormControl fullWidth>
                    <FormLabel id="role">Role</FormLabel>
                    <RadioGroup
                        aria-labelledby="role-radio-buttons-group"
                        name="role"
                        id="role"
                        row
                        defaultValue="examinee"
                        sx={{ gap: 4 }}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <FormControlLabel
                            value="examinee"
                            control={<Radio />}
                            label="Examinee"
                        />
                        <FormControlLabel
                            value="examiner"
                            control={<Radio />}
                            label="Examiner"
                        />
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <LoadingButton onClick={handleClose}>Signup</LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
