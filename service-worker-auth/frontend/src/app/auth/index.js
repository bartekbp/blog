import jwt from 'jsonwebtoken';

import module from 'module';

const storage = window.localStorage;

module.service('auth', class {

  async login(username) {
    try {
      const response = await fetch('/api/auth', {
        method: 'post',
        body: JSON.stringify({username,}),
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(resp => {
        if(resp.status === 200) {
          return resp.json();
        } else {
          throw resp;
        }
      });

      const {token,} = response;
      storage.setItem('token', token);
    } catch (error) {
      throw error.reason || 'Unknown error';
    }
  }

  isLoggedIn() {
    const token = storage.getItem('token');
    if(!token) {
      return false;
    }

    try {
      const { exp, } = jwt.decode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return exp > currentTime;
    } catch (err) {
      console.error('Error parsing storage data', err);
      storage.removeItem('token');
      return false;
    }
  }

  getAuthorizationHeader() {
    if(!this.isLoggedIn()) {
      return null;
    }

    const token = storage.getItem('token');
    return `Bearer ${token}`;
  }

  logout() {
    storage.removeItem('token');
  }
});
