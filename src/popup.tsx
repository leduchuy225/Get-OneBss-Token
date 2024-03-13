import { loginOneBSS } from "./api";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  TOKEN,
  HISTORY,
  getUsername,
  getFromLocal,
  saveUsername,
  removeFromLocal,
} from "./utils";

const Popup = () => {
  const [status, setStatus] = useState(false);
  const [maND, setMaND] = useState(getUsername());
  const [historyList, setHistoryList] = useState<string[]>([]);

  useEffect(() => {
    setHistoryList(getFromLocal(HISTORY) ?? []);
  }, []);

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

  const showMessage = () => {
    setStatus(true);
    const timeout = setTimeout(() => {
      setStatus(false);
      clearTimeout(timeout);
    }, 2000);
  };

  const onClick = async () => {
    const username = maND.trim();
    if (!username) {
      alert("Please enter username");
      return;
    }

    const data = await loginOneBSS(username).catch((error) => {
      removeFromLocal(TOKEN);
      return loginOneBSS(username);
    });

    if (!data["OneBSS-Token"]) {
      alert(data["Message-ToolOne"]);
      return;
    }

    saveUsername(username);
    const tokenData = JSON.parse(data["OneBSS-Token"]);
    const token = tokenData["access_token"];

    await navigator.clipboard.writeText(token);
    await accessLocalStorage(JSON.stringify(data));

    showMessage();
  };

  return (
    <>
      <label>Username</label>
      <br />
      <input
        autoFocus
        type="text"
        value={maND}
        list="historyList"
        defaultValue={maND}
        onChange={(event) => setMaND(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onClick();
          }
        }}
      />
      <datalist id="historyList">
        {historyList.map((data) => {
          const dataTrim = data.trim();
          return (
            <option key={dataTrim} value={dataTrim}>
              {dataTrim}
            </option>
          );
        })}
      </datalist>
      <br />
      <br />
      <button type="button" onClick={onClick}>
        Click Me
      </button>

      {status && (
        <div style={{ marginTop: 10 }}>
          <img src="ichinose.webp" width={100} height={100} alt="Successful" />
        </div>
      )}
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
