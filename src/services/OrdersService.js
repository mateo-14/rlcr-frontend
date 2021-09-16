import axios from 'axios';
import { dsAuthWithState } from '../util';

export function createOrder(data) {
  return axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, data, { withCredentials: true })
    .then(({ data }) => data)
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 401) {
          dsAuthWithState();
        } else if (err.response.status === 400) throw err;
      }
    });
}

export function getAllOrders(startAfter) {
  return axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/orders${startAfter ? `?startAfter=${startAfter}` : ''}`, {
      withCredentials: true,
    })
    .then(({ data }) => data);
}

export function getOrder(id) {
  return axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, { withCredentials: true })
    .then(({ data }) => data);
}

export function adminGetAllOrders(query, cancelToken) {
  return axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/all?${query}`, {
      withCredentials: true,
      cancelToken,
    })
    .then(({ data }) => data);
}

export function adminUpdateOrder(id, data) {
  return axios
    .put(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, data, { withCredentials: true })
    .then(({ data }) => data);
}
