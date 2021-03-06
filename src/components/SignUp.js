import React, { useContext, useState, useEffect, useLayoutEffect } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import { AuthContext } from '../firebase/Auth'
import SocialSignIn from './SocialSignIn';
import axios from 'axios';
import SignOut from "./SignOut"




function SignUp() {
    const { currentUser } = useContext(AuthContext);
    const [pwMatch, setPwMatch] = useState('');
    const [userNameCheck, setUserNameCheck] = useState('');
    const [userCheck, setUserCheck] = useState()

    useLayoutEffect(() => {
        const getData = async () => {
            try {
                if (currentUser) {
                    let status = await axios.post("http://localhost:8080/users/checkUser", { email: currentUser.email })
                    if (!status.data.flag)
                        setUserCheck(1)
                    else {
                        setUserCheck(2);
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
        getData();
    }, [currentUser]);

    if (currentUser != null) {
        console.log(userCheck)
        if (userCheck == 1) {
            return <Redirect to='/username' />;
        }
        else if (userCheck == 2) {
            return <Redirect to='/questions' />;
        }
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { userName, email, password1, password2 } = e.target.elements;

        try {
            let status = await axios.post("http://localhost:8080/users/checkUserName", { userName: userName.value });
            console.log(status.data.flag)
            console.log(typeof status.data.flag)
            if (status.data.flag === false) {
                setUserNameCheck("user name already exists, please try another user name")
                return false;
            }
        }
        catch (e) {
            console.log(e)
            alert(e);
        }

        if (password1.value !== password2.value) {
            setPwMatch('Passwords do not match');
            return false;
        }

        try {
            await doCreateUserWithEmailAndPassword(email.value, password1.value, userName.value);

            const payload = { name: userName.value, email: email.value }

            let status = await axios.post("http://localhost:8080/users/addUser", payload);
            console.log(status)

        } catch (e) {
            console.log(e)
            alert(e);

        }
    };

    return (
        <div>
            <h1>
                Sign Up
            </h1>

            {pwMatch && <h4 className='error'>{pwMatch}</h4>}
            {userNameCheck && <h4 className='error'>{userNameCheck}</h4>}
            <form onSubmit={handleSignUp}>
                <div className='form-group'>
                    <label>
                        User Name:
                         <input className='form-control' required name='userName' type='text' placeholder='User Name'></input>
                    </label>
                </div>
                <div className='form-group'>
                    <label>
                        Email:
                         <input className='form-control' required name='email' type='email' placeholder='email'></input>
                    </label>
                </div>
                <div className='form-group'>
                    <label>
                        Password:
                         <input className='form-control' required id='password1' name='password1' type='password'></input>
                    </label>
                </div>
                <div className='form-group'>
                    <label>
                        Confirm Password:
                         <input className='form-control' required id='password2' name='password2' type='password'></input>
                    </label>
                </div>
                <button id='submitButton' name='submitButton' type='submit' >Sign Up</button>
            </form>
            <br />
            <SocialSignIn></SocialSignIn>
            <SignOut />
            <br/>
            <label>Existing user?
                <nav>
                    <NavLink to='/signin'>Go to Sign-in page</NavLink>
                </nav>
            </label>
            
        </div>
    );

}

export default SignUp;