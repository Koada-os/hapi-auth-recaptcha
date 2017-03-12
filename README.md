### hapi-auth-recaptcha

Recaptcha authentication requires validating a Recaptcha token generated and sent by the browser via the get parameters or the payload. The `'recaptcha'` scheme takes the following options:

- `validateFunc` - (required) the function which is run once the Recaptcha has been verified `function(request, callback)` where:
    - `request` - is the hapi request object of the request which is being authenticated.
    - `callback` - a callback function with the signature `function(err, isValid)` where:
        - `err` - an internal error. If defined will replace default `Boom.unauthorized` error
        - `isValid` - `true` if both the username was found and the password matched, otherwise `false`.
- `recaptchaSecret` - (required) The secret key used to verify the Recaptcha token. You can get one [here](https://www.google.com/recaptcha/admin)
- `tokenName` - (optional) A custom name for the Recaptcha token payload / parameters. Default: `recaptchaToken`

### Usage

Send your request with the Recaptcha Token as a parameters or payload. Unless you have set `tokenName`, you have to use the recaptchaToken key.


```javascript

const validate = function (request, callback) {

    //No custom validation
    callback(null, true);
};

server.register(require('hapi-auth-recaptcha'), (err) => {

    server.auth.strategy('recaptcha', 'recaptcha', { validateFunc: validate });
    server.route({ method: 'GET', path: '/', config: { auth: 'recaptcha' } });
});
```
