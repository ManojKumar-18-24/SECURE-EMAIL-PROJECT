// Generate AES Key Once
import service from "../backend/config";

// Generate a Persistent AES Key
async function generateAESKey() {
    const aesKey = await crypto.subtle.generateKey(
            { name: "AES-CBC", length: 256 },
            true,
            ["encrypt", "decrypt"]
    );
    return aesKey;
}

// Encrypt File and Return id
async function encryptFile(file ,key) {
    if (!file) {
        throw new Error("No file provided for encryption!");
    }

    //const key = await generateAESKey();
    const iv = crypto.getRandomValues(new Uint8Array(16)); // Generate IV
    const fileData = await file.arrayBuffer();

    try {
        const encryptedData = await crypto.subtle.encrypt({ name: "AES-CBC", iv }, key, fileData);

        // Store original filename and type
        const metadata = JSON.stringify({ name: file.name, type: file.type });
        const metadataBytes = new TextEncoder().encode(metadata);

        // Use 2 bytes for metadata length
        const metadataLengthBuffer = new Uint16Array([metadataBytes.length]);

        // Create final Blob: [IV (16 bytes) + metadata length (2 bytes) + metadata + encrypted data]
        const encryptedFile =  new Blob([
            iv,
            new Uint8Array(metadataLengthBuffer.buffer),
            metadataBytes,
            new Uint8Array(encryptedData)
        ]);

        const finalFile = new File([encryptedFile], file.name + ".enc", { type: "application/octet-stream" });
        const response = await service.uploadFile(finalFile);
        return response.$id
    } catch (error) {
        console.error("Encryption error:", error);
        throw new Error("Encryption failed!");
    }
}

// Decrypt File from a given URL and Download
async function decryptFile(filename, fileUrl, key) {
    try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch the encrypted file.");
        }

        const fileData = await response.arrayBuffer();
        const dataView = new DataView(fileData);

        // Extract IV (first 16 bytes)
        const iv = new Uint8Array(fileData.slice(0, 16));

        // Read metadata length (2 bytes)
        const metadataLength = dataView.getUint16(16, true);

        // Extract metadata
        const metadataBytes = new Uint8Array(fileData.slice(18, 18 + metadataLength));
        const metadata = JSON.parse(new TextDecoder().decode(metadataBytes));

        // Extract encrypted data (remaining bytes)
        const encryptedData = fileData.slice(18 + metadataLength);

        // Perform AES decryption
        const decryptedData = await crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, encryptedData);

        // Convert decrypted data back to a file and download
        const decryptedBlob = new Blob([decryptedData], { type: metadata.type });

        // Ensure correct filename usage, removing `.enc` if present
        const cleanFilename = filename.replace(/\.enc$/, "");

        downloadFile(decryptedBlob, cleanFilename);
    } catch (error) {
        console.error("Decryption error:", error);
        alert("Decryption failed! Incorrect key, corrupted file, or fetch error.");
    }
}

// Helper function to download file
function downloadFile(blob, filename) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


// Encrypt a text string
async function encryptText(plainText, key) {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(16)); // Generate IV
    const encodedText = encoder.encode(plainText);

    try {
        const encryptedData = await crypto.subtle.encrypt(
            { name: "AES-CBC", iv },
            key,
            encodedText
        );

        // Combine IV and encrypted data
        const combinedData = new Uint8Array(iv.length + encryptedData.byteLength);
        combinedData.set(iv);
        combinedData.set(new Uint8Array(encryptedData), iv.length);

        return btoa(String.fromCharCode(...combinedData)); // Encode to Base64 for safe storage
    } catch (error) {
        console.error("Encryption error:", error);
        throw new Error("Encryption failed!");
    }
}

// Decrypt a text string
async function decryptText(encryptedText, key) {
    const decoder = new TextDecoder();
    const encryptedBytes = Uint8Array.from(atob(encryptedText), (c) => c.charCodeAt(0));

    // Extract IV and encrypted content
    const iv = encryptedBytes.slice(0, 16);
    const encryptedData = encryptedBytes.slice(16);

    try {
        const decryptedData = await crypto.subtle.decrypt(
            { name: "AES-CBC", iv },
            key,
            encryptedData
        );

        return decoder.decode(decryptedData); // Convert back to string
    } catch (error) {
        console.error("Decryption error:", error);
        throw new Error("Decryption failed!");
    }
}

async function exportKeyToBase64(key) {
    const exported = await crypto.subtle.exportKey("raw", key);
    const exportedKeyBuffer = new Uint8Array(exported);
    
    // Correct conversion to Base64
    let binaryString = "";
    for (let i = 0; i < exportedKeyBuffer.length; i++) {
        binaryString += String.fromCharCode(exportedKeyBuffer[i]);
    }
    
    return btoa(binaryString); // Properly encode as base64
}


async function importKeyFromBase64(base64Key) {
    console.log(base64Key)
    // Proper decoding from Base64
    const binaryString = atob(base64Key);
    const keyBuffer = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        keyBuffer[i] = binaryString.charCodeAt(i);
    }
    
    return await crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "AES-CBC", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}


// Export the functions
export { encryptFile, decryptFile, generateAESKey, encryptText, decryptText ,exportKeyToBase64 , importKeyFromBase64};

