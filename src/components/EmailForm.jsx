import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from './index';
import service from '../backend/config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function EmailForm() {
    const { register, handleSubmit, setValue } = useForm();
    const navigate = useNavigate();
    const userData = useSelector(state => state.userData);

    const [selectedFiles, setSelectedFiles] = useState([]);

    // Handle file selection
    const handleFileChange = (event) => {
        setSelectedFiles([...selectedFiles, ...event.target.files]);
    };

    // Remove a selected file
    const removeFile = (index) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    // Handle form submission
    const submit = async (data) => {
        console.log("Form Data:", data);
        console.log("Selected Files:", selectedFiles);

        // Here, you can handle file uploads before sending the email
        // Example: Upload files to Appwrite and get their URLs

        // After handling files, navigate or send form data
        navigate('/success'); // Change this as needed
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            {/* Subject Field */}
            <div className="w-2/3 px-2">
                <Input
                    label="Subject :"
                    placeholder="Subject"
                    className="mb-4"
                    {...register("subject")}
                />
            </div>

            {/* Description Field */}
            <div className="w-1/3 px-2">
                <Input
                    label="Description :"
                    type="text"
                    className="mb-4"
                    {...register("description")}
                />
            </div>

            {/* File Upload Field */}
            <div className="w-full px-2">
                <label className="block mb-2 font-medium">Attachments:</label>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="mb-2"
                />
                {/* Show Selected Files */}
                <ul className="mb-4">
                    {selectedFiles.map((file, index) => (
                        <li key={index} className="flex justify-between items-center border p-2 rounded-md">
                            {file.name}
                            <button
                                type="button"
                                className="text-red-500 ml-2"
                                onClick={() => removeFile(index)}
                            >
                                ✖
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Submit Button */}
            <div className="w-full px-2">
                <Button type="submit" bgColor="bg-green-500" className="w-full">
                    Submit
                </Button>
            </div>
        </form>
    );
}

export default EmailForm;
