import { loginToolOne } from "./api";

export const TOKEN = "accessToken";
export const USER_NAME = "userName";

export const saveToLocal = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const removeFromLocal = (key: string) => {
  localStorage.removeItem(key);
};

export const getFromLocal = (key: string) => {
  return localStorage.getItem(key);
};

export const getToolToken = async () => {
  const localToken = getFromLocal(TOKEN);
  if (localToken) {
    return localToken;
  }
  const data = await loginToolOne();
  saveToLocal(TOKEN, data.token);
  return data.token;
};

export const getUsername = () => {
  return getFromLocal(USER_NAME) ?? "admin_hpg";
};
