import { HRM_PASSWORD, getFromLocal, getToolToken } from "./utils";

export const loginToolOne = async () => {
  return fetch("http://10.35.65.20:1235/api/User/login", {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      giu_dn: true,
      ten_nd: "huyld",
      giu_dn_1thang: true,
      mat_khau: getFromLocal(HRM_PASSWORD),
    }),
  }).then((data) => data.json());
};

export const loginOneBSS = async (maMD: any) => {
  const token = await getToolToken();
  return fetch(
    `http://10.35.65.20:1235/api/Extention?ma_nd=${maMD}&cachefile=true&isdev=false`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "content-type": "application/json;charset=UTF-8",
      },
    }
  ).then((data) => {
    if (data.ok) {
      return data.json();
    }
    throw new Error();
  });
};
