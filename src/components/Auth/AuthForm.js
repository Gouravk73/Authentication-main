import { useState, useRef, useContext } from 'react';

import classes from './AuthForm.module.css';
import AuthContext from '../../store/auth-context';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const emailInputRef=useRef();
  const authCtx=useContext(AuthContext);
  const passwordInputRef=useRef();
  const[isLoading,setLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler=(event)=>{
    event.preventDefault();
    const enteredEmail=emailInputRef.current.value;
    const enteredPassword =passwordInputRef.current.value;
    //add validation
    setLoading(true);
    let url;
    if(isLogin){
      url='https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDZ02Lg8ai7KadcX0d0dwfR8J2RaxbpTkw'
      
    }
    else{
      url='https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDZ02Lg8ai7KadcX0d0dwfR8J2RaxbpTkw'
      
    }
    fetch(url,{
      method:"POST",
      body:JSON.stringify({
        email:enteredEmail,
        password:enteredPassword,
        returnSecureToken:true,
      }),
      headers: {
        'Content-Type':'application/json'
      }
    }).then(res=>{
      setLoading(false);
      if(res.ok){
        return res.json();
      }
      else{
        res.json().then(data=>{
          const errorMessage='Auth Failed!'
          // console.log(data);
          // alert(data.error.message);
          throw new Error(errorMessage);
        });
      } 
    }).then(data=>{
      authCtx.login(data.idToken)
      console.log(data);
    }).catch(error => {
      alert(error.errorMessage);
      // Handle other errors if necessary
    });
  }
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required  ref={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef}/>
        </div>
        <div className={classes.actions}>
          {isLoading&& <p>Loading</p> }
          <button>{isLogin?'Login':'create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
