import instance from './AjaxCrtl.js'
import browserHistory from '../BrowserHistory.js';

export default function (){
  instance().get('active')
    .then(response => {
      if (!response.data)
        browserHistory.push('/');
    }).catch(error => {
      console.log(error);
  });
}