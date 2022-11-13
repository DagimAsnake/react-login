import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

const emailReducer = (state, action) => {

  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') }
  }

  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') }
  }

  return { value: '', isValid: false }
}

const passwordReducer = (state, action) => {

  if (action.type === 'USER_INPUT') {
    return { passValue: action.value, passIsValid: action.value.trim().length > 6 }
  }

  if (action.type === 'INPUT_BLUR') {
    return { passValue: state.passValue, passIsValid: state.passValue.trim().length > 6 }
  }

  return { passValue: '', passIsValid: false }
}

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: null })
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, { passValue: '', passIsValid: null })

  const AuthCtx = useContext(AuthContext)

  useEffect(() => {
    console.log('effect is running')

    return () => {
      console.log('effect cleanUp')
    }
  }, [])

  const { isValid: emailIsValid } = emailState
  const { passIsValid: passwordIsValid } = passwordState

  useEffect((event) => {
    const identifier = setTimeout(() => {
      console.log('checking validdity')
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    }, 500)

    return () => {
      clearTimeout(identifier)
      console.log('clean up')
    }

  }, [emailIsValid, passwordIsValid])

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);

    dispatchEmail({ type: 'USER_INPUT', val: event.target.value })

    // setFormIsValid(
    //   event.target.value.includes('@') && passwordState.passIsValid
    // );
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);

    dispatchPassword({ type: 'USER_INPUT', value: event.target.value })

    // setFormIsValid(
    //   emailState.isValid && event.target.value.trim().length > 6
    // );
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(emailState.isValid);

    dispatchEmail({ type: 'INPUT_BLUR' })
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);

    dispatchPassword({ type: 'INPUT_BLUR' })
  };

  const emailRef = useRef()
  const passRef = useRef()

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      AuthCtx.onLogin(emailState.value, passwordState.passValue);
    } else if (!emailIsValid) {
      emailRef.current.focus()
    } else {
      passRef.current.focus()
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailRef}
          label='Email'
          type="email"
          id="email"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passRef}
          label='Password'
          type="password"
          id="password"
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} >
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
