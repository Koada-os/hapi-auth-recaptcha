'use strict';

// Load modules

const Boom = require('boom');
const Hoek = require('hoek');
const Request = require('request');


// Declare internals

const internals = {};


exports.register = function(plugin, options, next) {

    plugin.auth.scheme('recaptcha', internals.implementation);
    next();
};


exports.register.attributes = {
    pkg: require('../package.json')
};


internals.implementation = function(server, options) {

    Hoek.assert(options, 'Missing Recaptcha auth strategy options');
    Hoek.assert(options.recaptchaSecret, 'Missing Recaptcha secret key');
    Hoek.assert(typeof options.validateFunc === 'function', 'options.validateFunc must be a valid function in Recaptcha scheme');

    const settings = Hoek.clone(options);

    const scheme = {
        authenticate: function(request, reply) {

            let token;
            const headerName = settings.headerName || 'recaptcha-token'

            if (request.headers['recaptcha-token']) {
                token = request.headers[headerName];
            } else {
                return reply(Boom.unauthorized('Missing recaptcha-token header', 'Recaptcha'));
            }

            Request.post({
                url: 'https://google.com/recaptcha/api/siteverify',
                form: {
                    'secret': settings.recaptchaSecret,
                    'response': token
                }
            }, function(err, httpResponse, body) {

                if (err) {
                    return reply(Boom.serverUnavailable('Can\'t reach Recaptcha API', 'Recaptcha'));
                }
                if (JSON.parse(body).success === true && !err) {

                    settings.validateFunc(request, (error, isValid) => {

                        if (error) {
                            return reply(error, null, {});
                        }

                        if (!isValid) {
                            return reply(Boom.unauthorized('Custom verification failed', 'Recaptcha'));
                        }

                        return reply.continue({
                            credentials: {
                                token: token
                            }
                        });
                    });

                } else if (JSON.parse(body).success === false && !JSON.parse(body)['error-codes'] && !err) {
                    return reply(Boom.unauthorized('Expired or invalid Recaptcha Token', 'Recaptcha'));
                } else if (JSON.parse(body).success === false && JSON.parse(body)['error-codes'] && !err) {
                    return reply(Boom.unauthorized('Invalid Recaptcha Token', 'Recaptcha'));
                }
            })
        }
    };

    return scheme;
};
