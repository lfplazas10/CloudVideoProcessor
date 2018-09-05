import instance from './AjaxCrtl.js'

export default function (){
  instance().get('active')
    .then(response => {
      console.log(response)
      if (response.data){
      
      }
    }).catch(error => {
      console.log(error);
  });
}