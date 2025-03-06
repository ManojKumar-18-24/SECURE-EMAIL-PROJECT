// Generate AES Key Once
let aesKey = null;

// Generate a Persistent AES Key
async function generateAESKey() {
    if (!aesKey) {
        aesKey = await crypto.subtle.generateKey(
            { name: "AES-CBC", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
    }
    return aesKey;
}

// Encrypt File and Return Blob
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
        return new Blob([
            iv,
            new Uint8Array(metadataLengthBuffer.buffer),
            metadataBytes,
            new Uint8Array(encryptedData)
        ]);
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


export { encryptFile, decryptFile ,generateAESKey };
