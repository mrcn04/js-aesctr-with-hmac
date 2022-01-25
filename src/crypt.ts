import { SHA512, enc, AES, mode, pad, HmacSHA512, algo } from 'crypto-js';
import { randomBytes } from 'crypto';

// const BUFFER_SIZE: number = 16 * 1024;
const IV_SIZE = 16;
// const V1 = new Uint16Array(128);
const hmacSize = SHA512('TransferChain').toString(enc.Base64).length;

console.log('hmacSize', hmacSize);

// const ErrInvalidHMAC = new Error('Invalid HMAC');

const aesKey = [
  139, 46, 150, 181, 48, 123, 170, 178, 55, 133, 209, 214, 35, 46, 101, 32, 231, 24, 92, 86, 3, 41,
  59, 198, 221, 2, 193, 66, 26, 100, 154, 147,
];
const hmacKey = aesKey;

function Encrypt(inn?, out?, keyAes?, keyHmac?) {
  console.log(inn, out, keyAes, keyHmac);

  keyAes = aesKey;
  keyHmac = hmacKey;

  const iv = new Uint16Array(IV_SIZE);
  console.log('iv', iv);

  const rb = Array.from(randomBytes(IV_SIZE));
  if (!rb) return new Error();
  console.log('random bytes', rb);

  const aesWA = keyAes.map((x: unknown) => typeof x === 'number' && x.toString()).join('');

  console.log(111, aesWA);

  const aes = AES.encrypt('TransferChain', aesWA, {
    mode: mode.CTR,
    padding: pad.NoPadding,
  }).toString();

  console.log('aes', aes);

  const sha512 = algo.HMAC.create(algo.SHA512, aes.toString()).finalize();

  const hmacWA = keyHmac.map((x) => (typeof x === 'number' ? x.toString() : x)).join('');

  const hmac = HmacSHA512(sha512, hmacWA).toString();

  console.log('hmac', hmac);

  // throw ErrInvalidHMAC;
}

Encrypt();
