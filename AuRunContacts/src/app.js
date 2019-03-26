export class App {
  constructor() {
    // this.message = 'Hello World!';
    // this.repeater = [
    //   1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    //   ];
  }
  
  configureRouter(config, router){
    this.router = router;
    
    config.title = 'Aurelia - Info Enter';
    config.map([
      {
        route: [''],
        name: 'home',
        moduleId: 'home/index',
        title: 'AuRun contacts'
      },
      {
        route: ['insert'],
        name: 'insert',
        moduleId: 'insert/index',
        title: 'Inserting new contacts'
      },
      {
        route: ['edit/:name'],
        name: 'edit',
        moduleId: 'edit/index',
        title: 'Editing current contacts'
      }
    ])
  }
  
  alert(){
    alert('Teste 123');
  }
  
  
}

