import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { decryptText, importKeyFromBase64 } from "../cryptography/aes";

function EmailCard({ id, sender_id, receiver_id, subject, body, fileIds, aes_key }) {
  const [sub, setSub] = useState("");
  const [ebody, setEbody] = useState("");

  useEffect(() => {
    const getinfo = async () => {
      aes_key = await importKeyFromBase64(aes_key);
      subject = await decryptText(subject, aes_key);
      setSub(subject);
      body = await decryptText(body, aes_key);
      setEbody(body);
    };
    getinfo();
  }, [id]);

  return (
    <Link to={`emails/${id}`}>
      <div className="w-full p-4 border rounded-lg shadow-sm bg-white hover:bg-gray-50 cursor-pointer transition-all duration-200">
        <div className="flex justify-between items-center">
          {/* Sender Info */}
          <div className="flex items-center space-x-4">
            <span className="font-medium text-blue-600 text-sm truncate w-1/4">
              {sender_id}
            </span>
            <div className="text-gray-700 text-base font-semibold">
              {sub}
            </div>
          </div>
          
          {/* Attachment Count */}
          <span className="text-sm text-gray-500">
            Attachments: {fileIds.length}
          </span>
        </div>

        {/* Email Body Preview */}
        <div className="mt-2 text-gray-600 text-sm truncate">
          {ebody}
        </div>
      </div>
    </Link>
  );
}

export default EmailCard;
