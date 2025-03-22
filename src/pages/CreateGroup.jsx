// src/pages/CreateGroup.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import service from '../backend/config';
import { Container } from '../components';

function CreateGroup() {
    const [groupName, setGroupName] = useState('');
    const [users, setUsers] = useState([]); // Users added to group
    const [searchUser, setSearchUser] = useState('');
    const [error, setError] = useState('');
    const { userData } = useSelector((state) => state.userData);
    const navigate = useNavigate();

    // Check if the user exists and add to the list
    const handleAddUser = async () => {
        if (!searchUser.trim()) {
            setError('Please enter a valid user ID');
            return;
        }

        try {
            const response = await service.getUserDetailswithmail({mail :searchUser })
            if (response) {
                if (!users.some((user) => user.mail === searchUser)) {
                    setUsers([...users, { userId: response.$id , mail: searchUser, isAdmin: false }]);
                    setSearchUser('');
                    setError('');
                } else {
                    setError('User already added');
                }
            } else {
                setError('User does not exist');
            }
        } catch (err) {
            console.error('Error checking user:', err);
            setError('Error validating user');
        }
    };

    // Handle group creation
    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            setError('Group name cannot be empty');
            return;
        }

        if (!userData) {
            setError('You need to be logged in to create a group');
            return;
        }

        // Prepare group data
        const groupId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const groupData = {
            groupId,
            groupName,
            members: [
                { userId: userData.$id, isAdmin: true }, // Creator as admin
                ...users,
            ],
        };

        try {
            const response = await service.createGroup(groupData);
            if (response.success) {
                navigate(`/groups`);
            } else {
                setError('Error creating group');
            }
        } catch (err) {
            console.error('Error creating group:', err);
            setError('Error creating group');
        }
    };

    return (
        <div className="w-full py-8 bg-gray-100 min-h-screen">
            <Container>
                <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Group</h1>

                    {/* Group Name */}
                    <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">Group Name</label>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter group name"
                        />
                    </div>

                    {/* Add Users */}
                    <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">Add Users</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchUser}
                                onChange={(e) => setSearchUser(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter user ID"
                            />
                            <button
                                onClick={handleAddUser}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
                            >
                                Add
                            </button>
                        </div>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>

                    {/* Added Users List */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Added Users</h3>
                        <ul className="space-y-2">
                            {users.map((user) => (
                                <li key={user.userId} className="p-2 bg-gray-100 rounded-lg text-gray-700">
                                    {user.userId} {user.isAdmin ? '(Admin)' : ''}
                                </li>
                            ))}
                            {users.length === 0 && (
                                <p className="text-gray-500">No users added yet.</p>
                            )}
                        </ul>
                    </div>

                    {/* Create Group Button */}
                    <button
                        onClick={handleCreateGroup}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600"
                    >
                        Create Group
                    </button>
                </div>
            </Container>
        </div>
    );
}

export default CreateGroup;
