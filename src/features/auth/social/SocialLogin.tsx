import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import { CodeResponse, useGoogleLogin } from '@react-oauth/google';
import { useSigninUserWithGoogleMutation } from '@ReduxStore/apis/apiSlice';
import { useAppDispatch } from '@ReduxStore/hooks';
import { useState } from 'react';
import { ReactComponent as GoogleLoginIcon } from '../../../assets/googleIcon.svg';
import { authorizeUser } from '../authSlice';

function SocialLogin() {
    const [loadingStateOfSocialBtns, setLoadingStateOfSocialBtns] = useState({
        google: false,
    });
    const [googleAuthCode, setGoogleAuthCode] = useState('');
    const [shouldShowRolePopup, setShouldShowRolePopup] = useState(false);
    const dispatch = useAppDispatch();
    const [signInWithGoogle] = useSigninUserWithGoogleMutation();

    const googleLoginHandler = async (
        codeResponse: Omit<
            CodeResponse,
            'error' | 'error_description' | 'error_uri'
        >
    ) => {
        console.log(codeResponse);
        setGoogleAuthCode(codeResponse.code);
        const payload = {
            code: codeResponse.code,
            role: 'examinee',
        };
        const userDetails = await signInWithGoogle(payload);
        if ('error' in userDetails) {
            // Handle error
            return;
        }
        if ('data' in userDetails && 'token' in userDetails.data) {
            dispatch(authorizeUser(userDetails.data.token));
        }
    };
    const googleLogin = useGoogleLogin({
        onSuccess: googleLoginHandler,
        flow: 'auth-code',
    });
    return (
        <>
            <Divider>
                <IconButton onClick={() => googleLogin()}>
                    <SvgIcon component={GoogleLoginIcon} inheritViewBox />
                </IconButton>
            </Divider>
        </>
    );
}

export default SocialLogin;
