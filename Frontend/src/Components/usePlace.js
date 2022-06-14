import { useEffect, useState } from "react";

const url = "https://bed3-217-250-76-114.eu.ngrok.io/";

const postWithBody = (url, body) => {
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(body),
  };
  return fetch(url, fetchOptions)
    .then((response) => response.json())
    .then(({ message }) => console.log(message))
    .catch((reason) => {
      console.log(reason);
    });
};

const usePlace = () => {
  const [state, setState] = useState({ pixels: {}, showGrid: true });

  const loadPixels = () => {
    fetch(url + "allPixels")
      .then((response) => response.json())
      .then(({ allPixels }) => {
        console.log("allPixels", allPixels);
        const loadedPixels = {};
        allPixels.forEach(({ x, y, color }) => {
          loadedPixels[[x, y]] = color;
        });
        setState((previousState) => ({
          ...previousState,
          pixels: loadedPixels,
        }));
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  useEffect(() => {
    setInterval(() => loadPixels(), 5000);
  }, []);

  const place = (x, y, color, displayName) => {
    const body = { x, y, color, displayName };
    postWithBody(url + "place", body).then(() => loadPixels());
  };

  const clear = (x, y, displayName) => {
    const body = { x, y, displayName };
    postWithBody(url + "clear", body).then(() => loadPixels());
  };

  return { state, place, clear };
};

export default usePlace;
