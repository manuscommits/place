import { useEffect, useState } from "react";

const url = "https://0bca-217-250-64-27.eu.ngrok.io/";

const pixelSinceTime = 15000;

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
    .catch(console.log);
};

const usePlace = () => {
  const [state, setState] = useState({
    pixels: {},
    showGrid: true,
    displayName: "default",
    color: "black",
  });

  const place = (x, y) => {
    const body = { x, y, color: state.color, displayName: state.displayName };
    postWithBody(url + "place", body).then(loadPixelsSince);
  };

  const clear = (x, y) => {
    const body = { x, y, displayName: state.displayName };
    postWithBody(url + "clear", body).then(loadPixelsSince);
  };

  const setDisplayName = (displayName) => {
    setState((previousState) => ({ ...previousState, displayName }));
  };

  const setColor = (color) => {
    setState((previousState) => ({ ...previousState, color }));
  };

  const updatePixels = (newPixels) => {
    console.log("#pixels", newPixels.length);
    setState((previousState) => {
      const pixels = { ...previousState.pixels };
      newPixels.forEach(({ x, y, color }) => {
        if (color !== "clear") pixels[[x, y]] = color;
        else delete pixels[[x, y]];
      });
      return { ...previousState, pixels };
    });
  };

  const loadAllPixels = () => {
    fetch(url + "allPixels")
      .then((response) => response.json())
      .then(({ pixels }) => updatePixels(pixels))
      .catch(console.log);
  };

  const loadPixelsSince = () => {
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ since: Date.now() - pixelSinceTime }),
    };
    fetch(url + "pixelsSince", fetchOptions)
      .then((response) => response.json())
      .then(({ pixels }) => updatePixels(pixels))
      .catch(console.log);
  };

  useEffect(() => {
    loadAllPixels();
    setInterval(loadPixelsSince, 5000);
    // eslint-disable-next-line
  }, []);

  return { state, place, clear, setColor, setDisplayName };
};

export default usePlace;
