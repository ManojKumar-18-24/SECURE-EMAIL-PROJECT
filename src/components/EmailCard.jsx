import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { decryptText, importKeyFromBase64 } from "../cryptography/aes";
import { useSelector } from "react-redux";
import service from "../backend/config";
import { DecryptAesKey } from "../cryptography/rsa";
import { generateHash } from "../cryptography/hash";
function EmailCard({ id, sender_id, receiver_id, subject, body, fileIds, aes_key ,hash}) {
  const [sub, setSub] = useState("");
  const [ebody, setEbody] = useState("");
  const {userData} = useSelector(state => state.userData)
  const [verified,setVerified] = useState(false)
  useEffect(() => {
    const getinfo = async () => {
      if(aes_key === 'no_key'){
        const response = await service.getAESKEY({mailId:id,userId:userData.$id})
        //console.log(response)
        //console.log('haha')
        aes_key = response.documents[0].aes_key;
      }

      aes_key = await DecryptAesKey(aes_key);
      //console.log('hash bef dec:' ,hash)
      hash = await DecryptAesKey(hash)
      //console.log('hash our:',hash)
      aes_key = await importKeyFromBase64(aes_key);
      subject = await decryptText(subject, aes_key);
      setSub(subject);
      body = await decryptText(body, aes_key);
      setEbody(body);
      //console.log(await generateHash({userId:sender_id,subject:subject,body:body}))
      setVerified(hash === await generateHash({userId:sender_id,subject:subject,body:body}) )
    };
    getinfo();
  }, [id]);

  return (
    <Link to={`emails/${id}`}>
      {verified && <div className="w-full p-4 border rounded-lg shadow-sm bg-white hover:bg-gray-50 cursor-pointer transition-all duration-200">
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
    }
    {!verified && 
      <div>Hash false came</div>
    }
    </Link>
  );
}

export default EmailCard;
