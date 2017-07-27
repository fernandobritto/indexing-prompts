import { Contact } from './../Contact';

export class Home{
    constructor(){
        this.heading = 'List of contacts';
        this.contacts = new Contact().getData();
    }
};