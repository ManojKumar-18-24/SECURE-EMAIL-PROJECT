const conf = {
    appwriteUrl : String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId : String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId : String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteEmailId : String(import.meta.env.VITE_APPWRITE_CHAT_TABLE_COLLECTION_ID),
    appwriteUserDataId : String(import.meta.env.VITE_APPWRITE_USER_KEYS_ID),
    appwriteBucketId : String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appwriteGroupsId : String(import.meta.env.VITE_APPWRITE_GROUPS_ID),
    appwriteGroupsDataId : String(import.meta.env.VITE_APPWRITE_GROUP_DATA_ID),
    publicKey: String(import.meta.env.VITE_PUBLIC_KEY),
    privateKey: String(import.meta.env.VITE_PRIVATE_KEY)
}

console.log('conf: ',conf)

//console.log('conf = ',conf);
export default conf