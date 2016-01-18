'use strict';

import buffer from 'buffer';
import { AsyncStorage } from 'react-native';
import _ from 'lodash';

const authKey = 'auth';
const userKey = 'user';

class AuthService {
  getAuthInfo(cb) {
    AsyncStorage.multiGet(['auth', 'user'], (err, val) => {
      if (err) { return cb(err); }
      if (!val[0][1]) { return cb(); }

      const zippedObj = _.zipObject(val);

      if (!zippedObj['auth']) {
        return cb();
      }

      const authInfo = {
        header: {
          Authorization: 'Basic ' + Object.keys(zippedObj['auth'])[0]
        },
        user: JSON.parse(Object.keys(zippedObj['user'])[0])
      };

      return cb(null, authInfo);
    });
  }

  login(creds, cb) {
    const encodedAuth = new buffer.Buffer(
      creds.username + 
      ':' + creds.password).toString('base64');

    fetch('https://api.github.com/user', {
        headers: {
          'Authorization' : 'Basic ' + encodedAuth
        }
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }

        throw {
          badCredentials: response.status === 401,
          unknownError: response.status !== 401
        }
      })
      .then((response) => {
        return response.json();
      })
      .then((results) => {
        AsyncStorage.multiSet([
          ['auth', encodedAuth],
          ['user', JSON.stringify(results)]
        ], (err) => {
          if (err) {
            throw err;
          }

          return cb({ success: true });
        });
      })
      .catch((err) => {
        return cb(err);
      });
  }
};

export default new AuthService();