import { Request, md5 } from '@lzwme/fe-utils';
import CryptoJS from 'crypto-js';

export async function getCookieCloud( host: string, uuid: string, password: string) {
  const req = Request.getInstance();
  const url = host+'/get/'+uuid;
  const { data: json } = await req.get<{ encrypted: string; }>(url, {}, { "content-type": 'application/json' });
  let cookies: {
    domain: string;
    expirationDate: 1711635555.339812,
    hostOnly: true,
    httpOnly: false,
    name: string;
    path: string;
    sameSite: string;
    secure: false,
    session: false,
    storeId: string;
    value: string;
  }[] = [];

  console.log(json);

  if( json && json.encrypted) {
    const {cookie_data, local_storage_data } = cookie_decrypt(uuid, json.encrypted, password);
    for( const key in cookie_data ) {
      cookies = cookies.concat(cookie_data[key].map( item => {
        if( item.sameSite == 'unspecified' ) item.sameSite = 'Lax';
        return item;
      } ));
    }
  }
  return cookies;
}

function cookie_decrypt(uuid: string, encrypted: string, password: string) {
  const the_key = CryptoJS.MD5(uuid+'-'+password).toString().substring(0,16);
  const decrypted = CryptoJS.AES.decrypt(encrypted, the_key).toString(CryptoJS.enc.Utf8);
  const parsed = JSON.parse(decrypted);
  return parsed;
}

getCookieCloud('https://lzw.me/cookiecloud', '7YrU8iEC5B34sLZpr9zdKh', 'hzGPS88PfwZJRpiKdWaU1j')
.then(d => console.log(d));
