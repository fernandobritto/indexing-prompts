import {HttpClient, json} from 'aurelia-fetch-client';

let httpClient = new HttpClient();


export class Home{
    constructor(){
        this.button = 'Click here to get server data';
    }
    
    getFromServer(){
        console.log('HERE');
    }
};