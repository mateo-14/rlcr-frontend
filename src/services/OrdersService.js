import axios from 'axios';
import { dsAuthWithState } from '../util';

export function create(data) {
  return axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, { ...data }, { withCredentials: true })
    .then(({ data }) => data)
    .catch((err) => {
      console.log(err);
      if (err.response) {
        if (err.response.status === 401) {
          dsAuthWithState();
        } else if (err.response.status === 400) throw err;
      }
    });
}

export function getAll(startAfter) {
  return axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/orders${startAfter ? `?startAfter=${startAfter}` : ''}`, {
      withCredentials: true,
    })
    .then(({ data }) => data);
}

export function get(id) {
  return axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, { withCredentials: true })
    .then(({ data }) => data);
}

export function getAllAdmin(query, cancelToken) {
  return axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/all?${query}`, {
      withCredentials: true,
      cancelToken,
    })
    .then(({ data }) => data);
}