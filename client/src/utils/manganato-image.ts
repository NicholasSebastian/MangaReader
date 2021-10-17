import axios from "axios";

const ROOT_URL = "https://manganato.com/";

function getUrlHost(url: string) {
  const smatch = url.match(/\/(\w+\..+\.\w+)\//);
  return smatch![1];
}

export async function fetchImage(url: string) {
  const headers = {
    'Host': getUrlHost(url), 
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15',
    'Referer': ROOT_URL,
    'Accept': 'image/png,image/svg+xml,image/*;q=0.8,video/*;q=0.8,*/*;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-ca', 
    'Connection': 'keep-alive'
  };

  try {
    const response = await axios.get(url, { headers, responseType: "blob" });
    return response.data as Blob;
  }
  catch (e) {
    console.warn(e);
    return undefined;
  }
}