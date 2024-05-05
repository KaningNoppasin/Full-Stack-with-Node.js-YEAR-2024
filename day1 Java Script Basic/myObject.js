class Car{
    color;
    run(){
        console.log('run');
    }
    info(){
        console.log('color is' + this.color);
    }
}

const c = new Car();
c.run();
c.color = 'red';
c.info();