import helpers from '../helpers/helpers';

const path = require('path');
const assert = require('yeoman-assert');
const testhelpers = require('yeoman-test');
import * as AcsGenerator from '../index';
import * as fs from 'fs';
class test {

    public async run() {
        
        try {
            await testhelpers
                .run(AcsGenerator)
                .withPrompts(
                    {
                        windowsInstances: "1",
                        "linuxInstances": "1",
                        "gpuInstances": "2",
                        "dnsPrefix": "acstest",
                        "spClientId": "SomeServicePrincipleId",
                        "spSecret": "SomeServicePrincipleSecret",
                        "subscription": "SomeServiceSubscriptionId",
                        "resourceGroup": "acstestgroup",
                        "azureRegion": "southeastasia"
                    }
                ).then((dir)=>{
                    console.log(dir);
                    fs.readdirSync(dir).forEach(file => {
                        console.log(file);
                      })
                });

        }
        catch(e){
            console.log(e);
        }


        //var h = new helpers(__dirname);
        //h.GenerateRSAKeys();
        //h.GenerateStrongPassword();
    }
}

var t = new test();

t.run();