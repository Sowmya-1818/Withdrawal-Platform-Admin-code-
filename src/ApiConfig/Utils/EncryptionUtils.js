import CryptoJS from 'crypto-js';

const API_KEY = process.env.REACT_APP_API_KEY;

const EncryptionUtil = {
  encryptionAES: (msg) => {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(msg), API_KEY).toString();
    return ciphertext;
  },

  decryptionAES: (msg) => {
    if (msg) {
      const bytes = CryptoJS.AES.decrypt(msg, API_KEY);
      
      const originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      console.log(originalText, "originalText");
      
      return originalText;
    } else {
      return null;
    }
  },
};

export default EncryptionUtil;


     