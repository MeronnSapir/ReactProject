import { React, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Alert } from 'antd';

function Updates() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            // maybe trigger a loading screen
            <Alert message="You need to log in in order to use the website" type="warning" />
            navigate("/")
            return;
        }
        }, [user, loading]);
  return (
    <div>Updates</div>
  )
}

export default Updates