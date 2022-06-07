import React from 'react'
import {selectIsAuthorize} from '../features/auth/authSlice';
import { useNavigate } from "react-router-dom";
import { useAppSelector } from '../app/hooks';
function HomePage() {
  const isLogin:boolean = useAppSelector(selectIsAuthorize)
  let navigate = useNavigate();
  React.useEffect(()=>{
    if(!isLogin){
      navigate('/auth/signin');
    }
  },[navigate,isLogin])
  return (
    <div>AuthPage</div>
  )
}

export default HomePage