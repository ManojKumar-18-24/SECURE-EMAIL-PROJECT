async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Function to generate SHA-512 hash
async function generateHash({userId, subject, body}) {

    //console.log('in hash function',userId,subject,body)
    // Concatenate input strings
    const inputData = userId + subject + body;

    // Encode the input string as a Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(inputData);

    // Compute the hash using SHA-512
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);

    // Convert hash buffer to hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

// Example usage
// (async () => {
//     const userId = "12345";
//     const subject = "Project Update";
//     const body = "The project is progressing as planned.";

//     // Generate and print SHA-512 hash
//     const sha512Hash = await generateHash(userId, subject, body);
//     console.log("SHA-512 Hash:", sha512Hash);
// })();


//hashData("hello").then(console.log); // Always the same hash

export {
    hashPassword,
    generateHash
}
