import { Contact } from './../Contact';
export class Edit {
    constructor(){
        this.heading = 'Edit contact';
        this.contact - new Contact();
        this.reg = {};
    }
    
    activate(params, routeConfig) {
        this.routeConfig = routeConfig;
        this.reg = this.contact.getData().filter((el) => {
            return el.name == params.name;
        });
        
        this.name = this.reg[0].name;
        this.lastname = this.reg[0].lastname;
        this.telephone = this.reg[0].telephone;
    }
    
    editContact(){
        this.reg[0].name  = this.name;
        this.reg[0].lastname = this.lastname;
        this.reg[0].telephone = this.telephone;
    }
}