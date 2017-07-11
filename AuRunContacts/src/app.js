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
        title: 'Info Enter',
        redirect: 'main'
      },
      {
        route: ['main'],
        name: 'main',
        moduleId: 'home/index',
        title: 'Info Enter'
      }  
    ])
  }
  
  alert(){
    alert('Teste 123');
  }
  
  
}

