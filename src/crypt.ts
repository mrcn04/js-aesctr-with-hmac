import { SHA512, enc, AES, mode, pad, HmacSHA512, algo } from 'crypto-js';
import { randomBytes } from 'crypto';

// const BUFFER_SIZE: number = 16 * 1024;
const IV_SIZE = 16;
const V1 = '0x1';
const hmacSize = SHA512('TransferChain').toString(enc.Base64).length;

console.log('hmacSize', hmacSize);

const ErrInvalidHMAC = new Error('Invalid HMAC');

const aesKey = [
  139, 46, 150, 181, 48, 123, 170, 178, 55, 133, 209, 214, 35, 46, 101, 32, 231, 24, 92, 86, 3, 41,
  59, 198, 221, 2, 193, 66, 26, 100, 154, 147,
];
const hmacKey = aesKey;

function Encrypt(inn, out: Buffer, keyAes, keyHmac): Error {
  // const iv = new Uint16Array(IV_SIZE);
  // console.log('iv', iv);

  const iv = Array.from(randomBytes(IV_SIZE));
  if (!iv) return new Error();
  console.log('random bytes IV', iv);

  const aesWA = keyAes.map((x: unknown) => typeof x === 'number' && x.toString());

  console.log(111, JSON.stringify(aesWA));

  const aes = AES.encrypt(JSON.stringify(aesWA), JSON.stringify(iv), {
    mode: mode.CTR,
    padding: pad.NoPadding,
  }).toString();

  console.log('aes', aes);

  // const sha512 = algo.HMAC.create(algo.SHA512, aes).finalize();

  // const hmacWA = keyHmac.map((x: unknown) => (typeof x === 'number' ? x.toString() : x)).join('');

  const hmac = HmacSHA512(algo.SHA512.toString(), JSON.stringify(keyHmac)).toString();

  if (!hmac) return ErrInvalidHMAC;

  console.log('hmac', hmac);

  const w = Buffer.concat([out, Buffer.from(hmac)]);
  w.write(iv.toString());
  console.log('multi buffer', w);

  const buf = strToUtf16Bytes(inn);

  buf.forEach((b: never, i: number) => {
    if (b && i !== 0) {
      const outBuf = strToUtf16Bytes(i);
      console.log(outBuf);
    }
  });

  // throw ErrInvalidHMAC;
}

function strToUtf16Bytes(str) {
  const bytes = [];
  for (let ii = 0; ii < str.length; ii++) {
    const code = str.charCodeAt(ii);
    bytes.push(code & 255, code >> 8);
  }
  return bytes;
}

const msg = 'My Secret Message';

Encrypt(msg, Buffer.from(V1), aesKey, hmacKey);
