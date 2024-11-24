import Cookies from 'js-cookie';

export const getCookie = (cookieName) => {
  return Cookies.get(cookieName) || null;
};
