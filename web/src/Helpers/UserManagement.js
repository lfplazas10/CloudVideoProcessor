import instance from './AjaxCrtl.js'
import browserHistory from './BrowserHistory.js';
import cookie from 'react-cookies'

const authManager = {
  validateUser(){
    instance().get('active')
      .then(response => {
        if (!response.data) {
          browserHistory.push('/');
          cookie.remove('PLAY_SESSION');
        }
      }).catch(error => {
      console.log(error);
    });
  },
  logout(){
    instance().post('logout')
      .then(response => {
        cookie.remove('PLAY_SESSION');
        browserHistory.push('/');
      }).catch(error => {
      console.log(error);
    });
  }
};

export default authManager;