import helpers from './helpers';

class test{

    public run(){
        var h = new helpers();
        h.GenerateRSAKeys();
        h.GenerateStrongPassword();
    }
}

var t = new test();

t.run();