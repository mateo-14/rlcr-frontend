import axios from 'axios';

export function auth() {
  return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, { withCredentials: true }).then(({ data }) => data);
}

export function login(code) {
  return axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/auth`, { code: code }, { withCredentials: true })
    .then(({ data }) => data);
}

export function logout() {
  return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, null, { withCredentials: true });
}

export function get(id, cancelToken) {
  return axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      withCredentials: true,
      cancelToken,
    })
    .then(({ data }) => data);
}

export function getAllAdmin(cancelToken) {
  return axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/users/all`, { withCredentials: true, cancelToken })
    .then(({ data }) => data);
}
