import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';
const validationSchema = yup.object({
    password: yup
        .string()
        .min(6, 'Password should be of minimum 6 characters length')
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords dose not match')
        .required('Confirm password is required'),
    role: yup
        .string()
        .lowercase()
        .matches(/^examiner$|^examinee$/, 'Role can be examiner or examinee')
        .required('Role is required'),
});

type AdditionalInfoFormProps = {
    defaultRole: string;
};
export default function AdditionalInfoForm(props: AdditionalInfoFormProps) {
    const { defaultRole } = props;
    const [shouldShowPassword, setShowPassword] = useState(false);
    const [shouldShowConfirmPassword, setShowConfirmPassword] = useState(false);
    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
            role: defaultRole ?? 'examinee',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {},
    });
    const roleRadioBtns = (
        <FormControl
            fullWidth
            error={formik.touched.role && Boolean(formik.errors.role)}
        >
            <FormLabel id="role">Role</FormLabel>
            <RadioGroup
                aria-labelledby="role-radio-buttons-group"
                name="role"
                id="role"
                value={formik.values.role}
                row
                sx={{ gap: 4 }}
                onChange={formik.handleChange}
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
    );
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Additional Info
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type={shouldShowPassword ? 'text' : 'password'}
                        id="password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() =>
                                            setShowPassword(!shouldShowPassword)
                                        }
                                        onMouseDown={() =>
                                            setShowPassword(!shouldShowPassword)
                                        }
                                        edge="end"
                                    >
                                        {shouldShowPassword ? (
                                            <Visibility />
                                        ) : (
                                            <VisibilityOff />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        autoComplete="current-password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.password &&
                            Boolean(formik.errors.password)
                        }
                        helperText={
                            formik.touched.password && formik.errors.password
                        }
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={shouldShowConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !shouldShowConfirmPassword
                                            )
                                        }
                                        onMouseDown={() =>
                                            setShowConfirmPassword(
                                                !shouldShowConfirmPassword
                                            )
                                        }
                                        edge="end"
                                    >
                                        {shouldShowConfirmPassword ? (
                                            <Visibility />
                                        ) : (
                                            <VisibilityOff />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        autoComplete="confirm-password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.confirmPassword &&
                            Boolean(formik.errors.confirmPassword)
                        }
                        helperText={
                            formik.touched.confirmPassword &&
                            formik.errors.confirmPassword
                        }
                    />
                    {roleRadioBtns}
                    <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Save Info
                    </LoadingButton>
                </Box>
            </Box>
        </Container>
    );
}
