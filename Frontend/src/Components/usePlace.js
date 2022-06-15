import { useEffect, useState } from "react";

const url = "https://2770-217-250-64-27.eu.ngrok.io/";

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
    .then(({ success }) => console.log(success ? "Success" : "Failed"))
    .catch((reason) => console.log(reason));
};

const usePlace = () => {
  const [state, setState] = useState({ pixels: {}, showGrid: true });

  const updatePixels = (newPixels) => {
    console.log("#pixels", pixels.length);
    const pixels = { ...previousState.pixels };
    newPixels.forEach(({ x, y, color }) => {
      if (color !== "clear") pixels[[x, y]] = color;
      else delete pixels[[x, y]];
    });
    setState((previousState) => ({ ...previousState, pixels }));
  };

  const loadAllPixels = () => {
    fetch(url + "allPixels")
      .then((response) => response.json())
      .then(({ pixels }) => updatePixels(pixels))
      .catch((error) => console.log(error));
  };

  const loadPixelsSince = () => {
    const fetchOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ since: Date.now() - 60000 }),
    };
    fetch(url + "pixelsSince", fetchOptions)
      .then((response) => response.json())
      .then(({ pixels }) => updatePixels(pixels))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    loadAllPixels();
    setInterval(() => loadPixelsSince(), 5000);
  }, []);

  const place = (x, y, color, displayName) => {
    const body = { x, y, color, displayName };
    postWithBody(url + "place", body).then(loadPixelsSince);
  };

  const clear = (x, y, displayName) => {
    const body = { x, y, displayName };
    postWithBody(url + "clear", body).then(loadPixelsSince);
  };

  return { state, place, clear };
};

export default usePlace;
