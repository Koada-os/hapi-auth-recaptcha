'use strict';

// Load modules

const Boom = require('boom');
const Hoek = require('hoek');
const Request = require('request');


// Declare internals

const internals = {};


exports.register = function(plugin, options, next) {

    plugin.auth.scheme('Recaptcha', internals.implementation);
    next();
};


exports.register.attributes = {
    pkg: require('../package.json')
};


internals.implementation = function(server, options) {

        Hoek.assert(options, 'Missing Recaptcha auth strategy options');
        Hoek.assert(options.settings.recaptchaSecret, 'Missing Recaptcha secret key');
        Hoek.assert(typeof options.validateFunc === 'function', 'options.validateFunc must be a valid function in Recaptcha scheme');

        const settings = Hoek.clone(options);

        const scheme = {
                authenticate: function(request, reply) {

                        const method = request.method;
                        const payload = request.payload;
                        const tokenName = settings.tokenName || 'recaptchaToken';


                        if (params[tokenName]) {
                            const token = params[tokenName];
                        } else if (payload[tokenName]) {
                            const token = payload[tokenName];
                        } else {
                            return reply(Boom.unauthorized('Missing Recaptcha token', 'Recaptcha');
                            }

                            if (token) {
                                httpRequest.post({
                                        url: 'https://google.com/recaptcha/api/siteverify',
                                        form: {
                                            'secret': settings.recaptchaSecret,
                                            'response': token
                                        }
                                    }, function(err, httpResponse, body) {

                                        if (JSON.parse(body).success === true && !err) {

                                          settings.validateFunc(request, (error, isValid) => {

                                              if (error) {
                                                  return reply(error, null, {});
                                              }

                                              if (!isValid) {
                                                return reply(Boom.unauthorized('Custom verification failed', 'Recaptcha');
                                              }

                                              return reply.continue();
                                          });

                                        } else if (JSON.parse(body).success === false && JSON.parse(body)['error-codes'] && !err) {

                                            return reply(Boom.unauthorized('Invalid Recaptcha Token', 'Recaptcha');

                                            }
                                            else if (err) {

                                                return reply(Boom.serverUnavailable('Can\'t reach Recaptcha API', 'Recaptcha');

                                                }
                                            })
                                    }
                                }
                            };

                            return scheme;
                        };
