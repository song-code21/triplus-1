import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { naverOauth } from '../network/login/http';
import { useDispatch } from 'react-redux';
import { oauthLogin } from '../redux/login/action';
import Loading from '../components/common/Loading';

export default function NaverCallback() {
  const navigate = useNavigate();
  const url = new URL(window.location.href);
  const authorizationCode = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const dispatch = useDispatch();

  useEffect(() => {
    naverOauth(authorizationCode, state)
      .then((res) => {
        console.log(res);
        dispatch(oauthLogin());
        navigate(-1);
      })
      .catch((err) => {
        alert(err.response.data);
        navigate(-1);
      });
  }, [authorizationCode, navigate, dispatch, state]);

  return <Loading></Loading>;
}