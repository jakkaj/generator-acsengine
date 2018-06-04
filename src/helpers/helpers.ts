var keygen = require('ssh-keygen-temp');
import * as fs from 'fs';
import * as path from 'path';

import * as password from 'generate-password';

export default class Helpers {

    private _dirbase:string;
    private _baseTemplates:string;
    /**
     *
     */
    constructor(baseTemplates:string) {
        
        this._baseTemplates = baseTemplates;        
    }
    public Init(){

        this._dirbase = path.join(this._baseTemplates, 'keys');
            
        if(!fs.existsSync(this._dirbase)){
            fs.mkdirSync(this._dirbase);
        }
    }

    public GenerateRSAKeys(): Promise<string[]> {
        this.Init();
        return new Promise((good, bad)=>{           

            var location = path.join(this._dirbase, 'azure_rsa');
            var comment = 'key@azure';
            var password = false; // false and undefined will convert to an empty pw
    
            keygen({
                location: location,
                comment: comment,
                password: password,
                read: true
            }, function (err, out) {
                if (err) return console.log('Something went wrong: ' + err);
                console.log('Keys created!');
                console.log('private key: ' + out.key);
                console.log('public key: ' + out.pubKey);
                
                good([out.key, out.pubKey.trim()]);
            });
          
        });
        
        
    }

    public GenerateStrongPassword(): string {
        this.Init();

        var pass = password.generate({
            length: 25,
            numbers: true,
            uppercase: true,
            symbols: true,

        });

        pass = JSON.stringify(pass).replace(/^\"+|\"+$/g, "").replace(/\\/g, ""); //make it safe for things
        pass = pass.replace("\"", "");
        
        console.log(`Password: ${pass}`);

        var location = path.join(this._dirbase, 'windows_password.txt');
        fs.writeFileSync(location, pass);
        return pass;
    }
}