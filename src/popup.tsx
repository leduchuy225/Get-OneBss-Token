import { loginOneBSS } from "./api";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  TOKEN,
  USER_NAME,
  getUsername,
  saveToLocal,
  removeFromLocal,
} from "./utils";

const Popup = () => {
  const [maND, setMaND] = useState(getUsername());
  const [status, setStatus] = useState(false);

  const accessLocalStorage = async (data: string) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (tab.url?.includes("onebss.vnpt.vn")) {
      await chrome.scripting.executeScript({
        args: [data] as [string],
        target: { tabId: tab.id! },
        func: (value) => {
          localStorage.clear();
          const loginData = JSON.parse(value);
          for (const key in loginData) {
            localStorage.setItem(key, loginData[key]);
          }
          if (location.href.includes("/auth/login")) {
            location.href = "https://onebss.vnpt.vn/#/";
          }
          location.reload();
        },
      });
    }
  };

  const onClick = async () => {
    const username = maND.trim();
    if (!username) {
      alert("Please enter username");
      return;
    }

    saveToLocal(USER_NAME, username);
    const data = await loginOneBSS(username).catch((error) => {
      removeFromLocal(TOKEN);
      return loginOneBSS(username);
    });

    if (!data["OneBSS-Token"]) {
      alert(data["Message-ToolOne"]);
      return;
    }

    const tokenData = JSON.parse(data["OneBSS-Token"]);
    const token = tokenData["access_token"];

    await navigator.clipboard.writeText(token);
    await accessLocalStorage(JSON.stringify(data));

    setStatus(true);
  };

  return (
    <>
      <label>Username</label>
      <br />
      <input
        type="text"
        value={maND}
        defaultValue={maND}
        onChange={(event) => setMaND(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onClick();
          }
        }}
      />
      <br />
      <br />
      <button type="button" onClick={onClick}>
        Click Me
      </button>

      {status && <h2>Copy successfully !!!</h2>}
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
