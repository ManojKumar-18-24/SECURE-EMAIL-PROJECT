import { FaRegStar } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";

function EmailCard({ sender, subject, message, attachment, date }) {
  return (
    <div className="flex items-center p-3 border-b hover:bg-gray-100 cursor-pointer">
      {/* Star Icon */}
      <FaRegStar className="text-gray-400 mr-3" />

      {/* Email Details */}
      <div className="flex-grow flex items-center">
        {/* Sender Name */}
        <span className="font-medium text-gray-700 w-1/4 truncate">
          {sender}
        </span>

        {/* Subject & Message */}
        <div className="flex-grow text-gray-600 text-sm">
          <span className="font-semibold">{subject} - </span>
          <span className="truncate">{message}</span>
        </div>

        {/* Attachment (if exists) */}
        {attachment && (
          <div className="ml-4 flex items-center border px-2 py-1 rounded-md bg-gray-200">
            <IoDocumentText className="text-red-500 mr-1" />
            <span className="text-xs truncate">{attachment}</span>
          </div>
        )}
      </div>

      {/* Date */}
      <span className="text-gray-500 text-xs ml-3">{date}</span>
    </div>
  );
}

export default EmailCard;
