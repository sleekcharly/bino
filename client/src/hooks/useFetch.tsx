import { useEffect, useState } from 'react';

// get environment variable for API key
const API_KEY = import.meta.env.VITE_GIPHY_API;

type fetchProps = {
  keyword: string;
};

// main
const useFetch = ({ keyword }: fetchProps) => {
  const [gifUrl, setGifUrl] = useState('');

  const fetchGifs = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword
          .split(' ')
          .join('')}&limit=1`,
      );

      const { data } = await response.json();

      setGifUrl(data[0]?.images?.downsized_medium?.url);
    } catch (error) {
      setGifUrl(
        'https://i.pinimg.com/originals/68/a0/9e/68a09e774e98242871c2db0f99307420.gif',
      );
    }
  };

  useEffect(() => {
    if (keyword) fetchGifs();
  }, [keyword]);

  return gifUrl;
};

export default useFetch;
