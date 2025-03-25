import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import service from "../backend/config"; // Adjust import as needed
import {
  decryptText,
  decryptFile,
  importKeyFromBase64,
} from "../cryptography/aes";
import { nanoid } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { DecryptAesKey } from "../cryptography/rsa";
import { generateHash } from "../cryptography/hash";

const EmailViewer = () => {
  const { id } = useParams();
  const [email, setEmail] = useState(null);
  const [decryptedEmail, setDecryptedEmail] = useState({
    subject: "",
    body: "",
  });
  const [files, setFiles] = useState([]);
  const [aes_key, setKey] = useState("");
  const { userData } = useSelector((state) => state.userData);
  const [verified,setVerified] = useState(false)
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const emailData = await service.getEmail({ post_id: id });
        if (!emailData) {
          console.error("Email not found");
          return;
        }
        setEmail(emailData);

        if (emailData.aes_key === "no_key") {
          const response = await service.getAESKEY({
            mailId: id,
            userId: userData.$id,
          });
          //console.log(response);
          //console.log("hehe");
          emailData.aes_key = response.documents[0].aes_key;
        }

        emailData.aes_key = await DecryptAesKey(emailData.aes_key);
        const hash = await DecryptAesKey(emailData.hash)
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

        setVerified(hash === await generateHash({userId:emailData.sender_id,subject:decryptedSubject,body:decryptedBody}))
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
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        📩 Email Details
      </h1>

      {email && verified ? (
        <>
          {/* Subject Section */}
          <div className="p-4 bg-gray-100 rounded-lg shadow-sm mb-3">
            <p className="text-xl font-semibold text-gray-900">
              Subject: {decryptedEmail.subject}
            </p>
          </div>

          {/* Body Section */}
          <div className="p-5 bg-gray-50 rounded-lg shadow-sm mb-4 border border-gray-200">
            <div className="text-gray-900 font-semibold">Description:</div>
            <p className="text-gray-700 leading-relaxed">
              {decryptedEmail.body}
            </p>
          </div>

          {/* Attachments */}
          {files.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                📎 Attachments:
              </h2>
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
      {
        !verified && <div> Hash false came</div>
      }
    </div>
  );
};

export default EmailViewer;
