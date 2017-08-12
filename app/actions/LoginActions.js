import { LOGIN_SUCCESS, LOGOUT } from "./ActionTypes";

/*const login = (username, password) => {
    return dispatch => {
      DatabaseApi.login(this.state.username,this.state.password).then((user)=>{
        if(user && user.userid){
          dispatch(loginSucees(user));
        }else{
          dis
        }
      });
    };
  };*/

  export const loginSuccess = (user) => {return {type: LOGIN_SUCCESS, user}};
  export const logoutSuccess = () => {type: LOGOUT_SUCCESS};
  // export const isLogin = () => {}; // use null for type will return state (user)
