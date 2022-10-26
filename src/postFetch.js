import { Result } from "antd";

export const postRequest = async (url, data) => {
    console.log(url)
    const response = await fetch('127.0.0.1:5000/orders/report_order', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin' ,
    headers: {
        'Content-Type': 'application/json'
    },
        body: JSON.stringify(data),
      })
      return response
    // fetch(url, {
    //     method: 'POST',
    //     body: data
    // })
    //     .then( data => console.log(data) )
    //     .then( response => {
    //         response.json();
    //         return response
    //      } )
        // .then((result) => {
        //     console.log(result);
        //     return true
        // })
        // .catch((error) => {
        //     console.log(error);
        //     return false}
            
    return data
}