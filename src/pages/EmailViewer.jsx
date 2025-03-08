// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import service from "../backend/config"; // Adjust import as needed
// import { decryptText , decryptFile, importKeyFromBase64 , } from "../cryptography/aes";
// import { nanoid } from "@reduxjs/toolkit";
// // Use a proper key management approach

// const EmailViewer = () => {
//     const { id } = useParams();
//     const [email, setEmail] = useState(null);
//     const [decryptedEmail, setDecryptedEmail] = useState({ subject: "", body: "" });
//     const [files, setFiles] = useState([]);
//     const [aes_key,setKey] = useState("")
//     useEffect(() => {
//         const fetchEmail = async () => {
//             try {
//                 const emailData = await service.getEmail({post_id:id});
//                 if (!emailData) {
//                     console.error("Email not found");
//                     return;
//                 }
//                 setEmail(emailData);
                
//                 const key = await importKeyFromBase64(emailData.aes_key)

//                 setKey(key)
//                 // Decrypt subject and body
//                 const decryptedSubject = await decryptText(emailData.subject , key);
//                 const decryptedBody = await decryptText(emailData.body,key);
//                 setDecryptedEmail({ subject: decryptedSubject, body: decryptedBody });

//                 // Fetch attached files
//                 console.log('le:' , emailData.fileIds.length)
//                 if (emailData.fileIds?.length) {
//                     const files = [];
//                     for (const fileId of emailData.fileIds) {
//                         const file = await service.getFileDetails(fileId);
//                         console.log(file)
//                         files.push({ id ,name: file.name, url: file.url });
//                     }
//                     setFiles(files);
//                 }
                
//             } catch (error) {
//                 console.error("Error fetching email:", error);
//             }
//         };

//         fetchEmail();
//     }, [id]);


//     const handleDownloadDecryptedFile = async ({fileName,fileUrl,aesKey}) => {
//         await decryptFile(fileName, fileUrl ,aesKey);
//     };

//     return (
//         <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
//             <h1 className="text-2xl font-bold">Email Details</h1>

//             {email ? (
//                 <>
//                     <p className="text-lg"><strong>Subject:</strong> {decryptedEmail.subject}</p>
//                     <p className="mt-2"><strong>Body:</strong> {decryptedEmail.body}</p>
//                     {console.log('files: ', files)}
//                     {files.length > 0 && (
//                         <div className="mt-4">
//                             <h2 className="text-xl font-semibold">Attachments:</h2>
//                             <ul className="list-disc pl-5">
//                                 {files.map((file) => (
//                                     <li key={nanoid()}>
//                                         <button
//                                             onClick={() => handleDownloadDecryptedFile({fileName :file.name ,fileUrl: file.url ,aesKey: aes_key })}
//                                             className="text-blue-500 hover:underline"
//                                         >
//                                             {file.name.replace(".enc" , "")}
//                                         </button>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )}
//                 </>
//             ) : (
//                 <p>Loading email...</p>
//             )}
//         </div>
//     );
// };

// export default EmailViewer;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import service from "../backend/config"; // Adjust import as needed
import { decryptText, decryptFile, importKeyFromBase64 } from "../cryptography/aes";
import { nanoid } from "@reduxjs/toolkit";

const EmailViewer = () => {
    const { id } = useParams();
    const [email, setEmail] = useState(null);
    const [decryptedEmail, setDecryptedEmail] = useState({ subject: "", body: "" });
    const [files, setFiles] = useState([]);
    const [aes_key, setKey] = useState("");

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const emailData = await service.getEmail({ post_id: id });
                if (!emailData) {
                    console.error("Email not found");
                    return;
                }
                setEmail(emailData);

                const key = await importKeyFromBase64(emailData.aes_key);
                setKey(key);

                const decryptedSubject = await decryptText(emailData.subject, key);
                const decryptedBody = await decryptText(emailData.body, key);
                setDecryptedEmail({ subject: decryptedSubject, body: decryptedBody });

                if (emailData.fileIds?.length) {
                    const files = [];
                    for (const fileId of emailData.fileIds) {
                        const file = await service.getFileDetails(fileId);
                        files.push({ id: nanoid(), name: file.name, url: file.url });
                    }
                    setFiles(files);
                }
            } catch (error) {
                console.error("Error fetching email:", error);
            }
        };

        fetchEmail();
    }, [id]);

    const handleDownloadDecryptedFile = async ({ fileName, fileUrl, aesKey }) => {
        await decryptFile(fileName, fileUrl, aesKey);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">📩 Email Details</h1>

            {email ? (
                <>
                    {/* Subject Section */}
                    <div className="p-4 bg-gray-100 rounded-lg shadow-sm mb-3">
                        <p className="text-xl font-semibold text-gray-900">Subject: {decryptedEmail.subject}</p>
                    </div>

                    {/* Body Section */}
                    <div className="p-5 bg-gray-50 rounded-lg shadow-sm mb-4 border border-gray-200">
                        <div className="text-gray-900 font-semibold">Description:</div>
                        <p className="text-gray-700 leading-relaxed">{decryptedEmail.body}</p>
                    </div>

                    {/* Attachments */}
                    {files.length > 0 && (
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">📎 Attachments:</h2>
                            <div className="flex flex-wrap gap-3">
                                {files.map((file) => (
                                    <button
                                        key={file.id}
                                        onClick={() =>
                                            handleDownloadDecryptedFile({
                                                fileName: file.name,
                                                fileUrl: file.url,
                                                aesKey: aes_key,
                                            })
                                        }
                                        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                                    >
                                        {file.name.replace(".enc", "")}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-gray-500 text-center">Loading email...</p>
            )}
        </div>
    );
};

export default EmailViewer;
