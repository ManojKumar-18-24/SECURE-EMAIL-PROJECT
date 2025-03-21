const conf = {
    appwriteUrl : String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId : String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId : String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteEmailId : String(import.meta.env.VITE_APPWRITE_CHAT_TABLE_COLLECTION_ID),
    appwriteUserDataId : String(import.meta.env.VITE_APPWRITE_USER_KEYS_ID),
    appwriteBucketId : String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appwriteGroupsId : String(import.meta.env.VITE_APPWRITE_GROUPS_ID)
}

console.log('conf: ',conf)

//console.log('conf = ',conf);
export default conf