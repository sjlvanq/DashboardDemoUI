import api from '../utils/api';

const AuthService = {
  login: async (username, password) => {
    const data = { username, password };
    return api.post('Tokens/login', data);
  },
};

export default AuthService;
