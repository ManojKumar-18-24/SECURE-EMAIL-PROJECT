import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from './index';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import service from '../backend/config';
import { generateAESKey , encryptFile , encryptText , exportKeyToBase64} from '../cryptography/aes';

function EmailForm({groupId = "abc" , to = true}) {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.userData);
    
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        setSelectedFiles([...selectedFiles, ...event.target.files]);
    };

    const removeFile = (index) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    const submit = async (data) => {
        console.log("Form Data:", data.to);
        // console.log("Selected Files:", selectedFiles);
        // navigate('/success');
        let receiver
        if(data.to){
            receiver = await service.getUserDetailswithmail({mail :data.to })
            data.receiver_id = receiver.$id;
        } 

        if(data.to && !receiver){
            setError("no user found")
            return 
        }
        data.sender_id = userData.$id
        const AES_KEY = await generateAESKey() 
        console.log('aes key: ',AES_KEY)
        data.groupId = groupId
        let fileIds = []
        
        for (let i = 0; i < selectedFiles.length; i++) {
            const fileid = await encryptFile(selectedFiles[i] , AES_KEY)
            fileIds.push(fileid);
        }
        
        data.subject = await encryptText(data.subject , AES_KEY)
        data.body = await encryptText(data.body , AES_KEY)
        data.fileIds = fileIds
        data.aes_key = await exportKeyToBase64(AES_KEY)

        console.log('key = ',data.aes_key)
        const email = await service.createEmail(data)
        
        console.log(email)

        if(!email) return

        navigate('/') 
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-4">
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <form onSubmit={handleSubmit(submit)}>
                {/* To Field */}
                { to && <Input
                    label="To"
                    placeholder="Recipient email"
                    className="w-full text-lg border-none focus:ring-0"
                    {...register("to", { required: true })}
                />
                }
                {/* Subject Field */}
                <Input
                    label="Subject"
                    placeholder="Subject"
                    className="w-full border-none focus:ring-0"
                    {...register("subject")}
                />
                
                {/* Email Body */}
                <textarea
                    {...register("body")}
                    placeholder="Compose your email..."
                    className="w-full mt-3 h-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                
                {/* File Upload */}
                <div className="mt-3">
                    <label className="text-gray-600">Attachments:</label>
                    <input type="file" {...register("files")}  multiple onChange={handleFileChange} className="w-full mt-1" />
                    {/* Display Selected Files */}
                    <ul className="mt-2">
                        {selectedFiles.map((file, index) => (
                            <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md mt-1">
                                {file.name}
                                <button type="button" className="text-red-500" onClick={() => removeFile(index)}>✖</button>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Send Button */}
                <div className="mt-4 flex justify-end">
                    <Button type="submit" bgColor="bg-blue-600" className="px-5 py-2 text-white rounded-md hover:bg-blue-700">
                        Send
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default EmailForm;
