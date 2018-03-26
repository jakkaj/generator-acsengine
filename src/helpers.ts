var keygen = require('ssh-keygen');
var fs = require('fs');

import * as password from 'generate-password';

export default class Helpers {
    public GenerateRSAKeys(): Promise<string[]> {
        return new Promise((good, bad)=>{
            var location = __dirname + '/foo_rsa';
            var comment = 'joe@foobar.com';
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
                
                good([out.key, out.pubKey]);
            });
          
        });
        
        
    }

    public GenerateStrongPassword(): string {
        var pass = password.generate({
            length: 25,
            numbers: true,
            uppercase: true,
            symbols: true,

        });
        console.log(`Password: ${pass}`);
        return "";
    }
}