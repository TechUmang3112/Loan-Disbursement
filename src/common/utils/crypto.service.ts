// Import
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || 'DCNkYDaV16mLEjeaRzMK3UuRaxBCTsTXFvrJpX+OuYw=';
function getKey(): Buffer {
  return crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest();
}

export function encryptField(plain: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plain, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  const out = Buffer.concat([iv, tag, encrypted]).toString('base64');
  return out;
}

export function decryptField(payloadBase64: string): string | null {
  try {
    const key = getKey();
    const b = Buffer.from(payloadBase64, 'base64');
    const iv = b.slice(0, 12);
    const tag = b.slice(12, 28);
    const ciphertext = b.slice(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  } catch (err) {
    return null;
  }
}

export function hashField(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export async function crypt(password: string) {
  return bcrypt.hash(password, 10);
}
