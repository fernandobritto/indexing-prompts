import { Contact } from './../Contact';

export class Home{
    constructor(){
        this.heading = 'List of contacts';
        this.contacts = new Contact().getData();
    }
    
    deleteContact(name){
        this.reg = this.contacts.filter((el) => {
            return el.name == name;
        });
        
        let index = this.contact.indexOf(this.reg[0]);
        
        if(index !== -1){
            this.contacts.splice(index, 1);
        }
    }
};