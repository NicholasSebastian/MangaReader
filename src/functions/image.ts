import axios from "axios";
// global.Buffer = global.Buffer || require('buffer').Buffer;

const ROOT_URL = "http://manganato.com/";

function getUrlHost(url: string) {
  const smatch = url.match(/\/(\w+\..+\.\w+)\//);
  return smatch![1];
}

function toBase64(blob: Blob) {
  return new Promise<Base64Result>((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// TODO: Why is this not working.
// Maybe try test it with some dummy base64 strings?

export async function fetchImage(url: string) {
  const headers = {
    'Host': getUrlHost(url), 
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15',
    'Referer': ROOT_URL,
    'Accept': 'image/png,image/svg+xml,image/*;q=0.8,video/*;q=0.8,*/*;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-ca', 
    'Connection': 'keep-alive'
  }

  const response = await axios.get(url, { headers, responseType: "arraybuffer" });
  
  // const base64Data = Buffer.from(response.data, "binary").toString("base64");
  // const mimetype = response.headers["content-type"];
  // const imageUri = `data:${mimetype};base64,${base64Data}`;
  
  const imageUri = await toBase64(response.data);
  return imageUri;
}

type Base64Result = string | ArrayBuffer | null;