import conf from '/src/conf/conf.js';

const { privateKey, publicKey } = conf;

// async function generateRSAKeys() {
//     const rsaKeyPair = await crypto.subtle.generateKey(
//         {
//             name: "RSA-OAEP",
//             modulusLength: 2048,
//             publicExponent: new Uint8Array([1, 0, 1]),
//             hash: "SHA-256",
//         },
//         true,
//         ["encrypt", "decrypt"]
//     );

//     return rsaKeyPair;
// }


// async function exportRSAKeyToBase64(key, isPublic = true) {
//     const exported = await crypto.subtle.exportKey(
//         isPublic ? "spki" : "pkcs8",
//         key
//     );
//     const exportedKeyBuffer = new Uint8Array(exported);
//     return btoa(String.fromCharCode(...exportedKeyBuffer));
// }


async function importRSAKeyFromBase64(base64Key, isPublic = true) {
    const keyBuffer = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));

    return await crypto.subtle.importKey(
        isPublic ? "spki" : "pkcs8",
        keyBuffer.buffer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        isPublic ? ["encrypt"] : ["decrypt"]
    );
}

async function encryptWithRSA(publicKey, plainText) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(plainText);

    const encryptedData = await crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        publicKey,
        dataBuffer
    );

    return btoa(String.fromCharCode(...new Uint8Array(encryptedData))); // Base64 encode
}


async function decryptWithRSA(privateKey, encryptedBase64) {
    const encryptedBuffer = Uint8Array.from(
        atob(encryptedBase64),
        c => c.charCodeAt(0)
    );

    const decryptedData = await crypto.subtle.decrypt(
        {
            name: "RSA-OAEP",
        },
        privateKey,
        encryptedBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
}

const EncryptAesKey = async (message) => {
    const publicKeyBase64 = publicKey
    const importedPublicKey = await importRSAKeyFromBase64(publicKeyBase64, true);
    const encryptedMessage = await encryptWithRSA(importedPublicKey, message);
    return encryptedMessage
}

const DecryptAesKey = async(encryptedMessage) => {
    const privateKeyBase64 = privateKey
    const importedPrivateKey = await importRSAKeyFromBase64(privateKeyBase64, false);
    const decryptedMessage = await decryptWithRSA(importedPrivateKey, encryptedMessage);
    return decryptedMessage
}

const RSA = async (message)  => {
    // Generate RSA keys
    //const rsaKeys = await generateRSAKeys();

    // Export keys to Base64
    const publicKeyBase64 = publicKey
    const privateKeyBase64 = privateKey

    console.log("Public Key (Base64):", publicKeyBase64);
    console.log("Private Key (Base64):", privateKeyBase64);

    // Import keys from Base64
    const importedPublicKey = await importRSAKeyFromBase64(publicKeyBase64, true);
    const importedPrivateKey = await importRSAKeyFromBase64(privateKeyBase64, false);

    // Encrypt a message
    //const message = "Hello, secure world!";
    const encryptedMessage = await encryptWithRSA(importedPublicKey, message);
    console.log("Encrypted Message:", encryptedMessage);

    // Decrypt the message
    const decryptedMessage = await decryptWithRSA(importedPrivateKey, encryptedMessage);
    console.log("Decrypted Message:", decryptedMessage);

    return {encryptedMessage , decryptedMessage}
};

export {
    EncryptAesKey,
    DecryptAesKey,
    RSA
}
