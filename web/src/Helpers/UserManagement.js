import instance from './AjaxCrtl.js'
import browserHistory from '../BrowserHistory.js';
import cookie from 'react-cookies'

export default function (){
  instance().get('active')
    .then(response => {
      if (!response.data) {
        browserHistory.push('/');
        cookie.remove('PLAY_SESSION');
      }
    }).catch(error => {
      console.log(error);
  });
}