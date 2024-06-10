import useDocumentTitle from '@CustomHook/useDocumentTitle';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useSigninUserMutation } from '@ReduxStore/apis/apiSlice';
import { useAppDispatch, useAppSelector } from '@ReduxStore/hooks';
import { getErrorText, showToast } from '@SharedFunction/utility';
import { useFormik } from 'formik';
import { pipe } from 'ramda';
import { useEffect, useState } from 'react';
import {
  Location,
  Link as RouterLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import * as yup from 'yup';
import authBgcImg from '../../../assets/authBgc.jpg';
import Copyright from '../../../shared/components/Copyright';
import { authorizeUser, selectIsAuthenticated } from '../authSlice';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
});

export default function Signin() {
  // Change Document Tile
  useDocumentTitle('Quiz App | Signin');
  const [signinUser, { isLoading, isError, error }] = useSigninUserMutation();
  const isLogin = useAppSelector(selectIsAuthenticated);
  const [shouldShowPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = getRedirectLocation(location);

  useEffect(() => {
    if (isLogin) navigate(from);
  }, [isLogin, navigate, from]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let data = await signinUser(values);
      if ('error' in data) {
        pipe(getErrorText, (errorText) => showToast(errorText, 'error'))(
          data.error
        );

        return;
      }
      if ('data' in data && 'token' in data.data) {
        pipe(authorizeUser, dispatch)(data.data.token);
      }
    },
  });
  return (
    <>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${authBgcImg})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
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
                        onClick={() => setShowPassword(!shouldShowPassword)}
                        onMouseDown={() => setShowPassword(!shouldShowPassword)}
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
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" disabled />}
                label="Remember me"
              />
              <LoadingButton
                loading={isLoading}
                type="submit"
                loadingPosition="end"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                endIcon={<ArrowRightIcon />}
              >
                Sign In
              </LoadingButton>
              <Grid container>
                <Grid item xs>
                  <RouterLink to={'#'} style={{ textDecoration: 'none' }}>
                    <Typography
                      variant="body2"
                      gutterBottom
                      color={'primary'}
                      sx={{ textDecoration: 'underline' }}
                    >
                      {'Forgot password?'}
                    </Typography>
                  </RouterLink>
                </Grid>
                <Grid item>
                  <RouterLink
                    to={'/auth/signup'}
                    style={{ textDecoration: 'none' }}
                  >
                    <Typography
                      variant="body2"
                      gutterBottom
                      color={'primary'}
                      sx={{ textDecoration: 'underline' }}
                    >
                      {"Don't have an account? Sign Up"}
                    </Typography>
                  </RouterLink>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
interface ReactRouterLocationStateType {
  from: { pathname: string };
}
// Util Function
function getRedirectLocation(location: Location) {
  let state: ReactRouterLocationStateType =
    location.state as ReactRouterLocationStateType;
  return state?.from?.pathname ?? '/';
}
