import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { decryptText, importKeyFromBase64 } from "../cryptography/aes";

function EmailCard({id, sender_id, receiver_id, subject,body, fileIds , aes_key }) {

  const [sub,setSub] = useState("")
  const [ebody,setEbody] = useState("")

  useEffect(() => {
    const  getinfo = async () => {
      aes_key = await importKeyFromBase64(aes_key)
      subject = await decryptText(subject,aes_key)
      setSub(subject)
      body = await decryptText(body,aes_key)
      setEbody(body)
    }
      getinfo()
  },[id])

  return (
    <Link to={`emails/${id}`}>
    <div className="flex items-center p-3 border-b hover:bg-gray-100 cursor-pointer">
      {/* Star Icon */}
      {/*<FaRegStar className="text-gray-400 mr-3" />*/}

      {/* Email Details */}
      <div className="flex-grow flex items-center">
        {/* Sender Name */}
        <span className="font-medium text-gray-700 w-1/4 truncate">
          {sender_id}
        </span>

        {/* Subject & Message */}
        <div className="flex-grow text-gray-600 text-sm">
          <span className="font-semibold">{sub} - </span>
          <span className="truncate">{ebody}</span>
          <span className="truncate">{`Attachments : ${fileIds.length}`}</span>
        </div>

      </div>
    </div>
    </Link>
  );
}

export default EmailCard;
