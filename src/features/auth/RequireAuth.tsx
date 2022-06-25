import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectIsAuthorize } from './authSlice';

function RequireAuth({ children }: { children: JSX.Element }) {
	const isAuthorized = useAppSelector(selectIsAuthorize);
	let location = useLocation();
	if (isAuthorized) return children;
	return <Navigate to='/auth/signin' state={{ from: location }} replace />;
}

export default RequireAuth;
