import { loginToolOne } from "./api";

export const TOKEN = "accessToken";
export const USER_NAME = "userName";
export const HISTORY = "historyList";

export const saveToLocal = (key: string, value: string | number | object) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeFromLocal = (key: string) => {
  localStorage.removeItem(key);
};

export const getFromLocal = (key: string) => {
  const data = localStorage.getItem(key);
  return data != null ? JSON.parse(data) : null;
};

export const saveUsername = (username: string) => {
  saveToLocal(USER_NAME, username);
  addToHistory(username);
};

export const addToHistory = (username: string) => {
  const historyList: string[] = getFromLocal(HISTORY) ?? [];

  if (historyList.indexOf(username) == -1) {
    historyList.push(username);
    saveToLocal(HISTORY, historyList);
  }
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
