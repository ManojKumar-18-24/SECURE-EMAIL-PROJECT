// src/pages/Groups.jsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import service from '../backend/config';
import { Container } from '../components';

function Groups() {
    const [groups, setGroups] = useState([]);
    const { userData } = useSelector((state) => state.userData) || { undefined };
    const navigate = useNavigate();

    // Fetch group data
    const getGroups = async () => {
        if (userData) {
            try {
                // Fetch group info
                const groupData = await service.getGroups({ userId: userData.$id });
                setGroups(groupData.documents);
                //console.log(groupData.documents)
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        }
    };

    useEffect(() => {
        getGroups();
    }, [userData]);

    if (!userData) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex justify-center">
                        <h1 className="text-2xl font-bold text-gray-700 hover:text-gray-500 cursor-pointer">
                            Login to view Groups
                        </h1>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="w-full py-8 bg-gray-100 min-h-screen">
            <Container>
                {/* Create Group Button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Your Groups</h1>
                    <button
                        onClick={() => navigate('/create-group')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
                    >
                        + Create Group
                    </button>
                </div>

                {/* Group List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {groups?.map((group) => (
                        <div
                            key={group.$id}
                            className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                            onClick={() => navigate(`/groups/${group.groupId}`)}
                        >
                            <h3 className="text-lg font-semibold text-gray-800">{group.groupName}</h3>
                        </div>
                    ))}
                    {groups?.length === 0 && (
                        <p className="text-gray-500 col-span-full text-center">No groups available. Create one now!</p>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default Groups;
