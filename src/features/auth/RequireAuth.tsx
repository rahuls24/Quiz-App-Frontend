import UnauthorizedPage from '@Page/UnauthorizedPage';
import { useAppSelector } from '@ReduxStore/hooks';
import jwtDecode from 'jwt-decode';
import { Navigate, useLocation } from 'react-router-dom';
import { selectAuthToken, selectIsAuthenticated } from './authSlice';
const examineeAuthorizedPath = ['/quiz/history'];
const examinerAuthorizedPath = ['/quiz/make-a-quiz'];
const commonUserAuthorizedPath = ['/'];
function RequireAuth({ children }: { children: JSX.Element }) {
    let location = useLocation();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const authToken = useAppSelector(selectAuthToken);
    const isAuthorized = isUserAuthorized(location.pathname, authToken);
    console.log(isAuthorized, authToken);
    if (isAuthenticated && isAuthorized) return children;
    else if (isAuthenticated && !isAuthorized) return <UnauthorizedPage />;
    else
        return (
            <Navigate to="/auth/signin" state={{ from: location }} replace />
        );
}

export default RequireAuth;

// Util Function
function isUserAuthorized(path: string, authToken?: null | string) {
    if (!authToken) return false;
    const userDetails = getUserDetails(authToken);
    if (userDetails === null) return false;
    const { expiryTime, userRole } = userDetails;
    if (Date.now() >= expiryTime * 1000) return false;
    if (userRole === 'examinee')
        return (
            examineeAuthorizedPath.includes(path) ||
            commonUserAuthorizedPath.includes(path)
        );
    else if (userRole === 'examiner')
        return (
            examinerAuthorizedPath.includes(path) ||
            commonUserAuthorizedPath.includes(path)
        );

    return false;
}

function getUserDetails(token: string) {
    const userDetails: any = jwtDecode(token);
    let expiryTime = 0;
    let userRole = '';
    if (
        typeof userDetails === 'object' &&
        !Array.isArray(userDetails) &&
        userDetails !== null
    ) {
        if ('exp' in userDetails) {
            expiryTime = Number(userDetails.exp);
        }
        if ('data' in userDetails && 'role' in userDetails.data) {
            userRole = String(userDetails.data.role);
        }
    }
    if (expiryTime === 0 || userRole === '') return null;
    return {
        expiryTime,
        userRole,
    };
}
