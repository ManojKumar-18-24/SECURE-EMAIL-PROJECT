import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";
import authService from "./auth";

class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createEmail({
    sender_id,
    receiver_id,
    subject,
    body,
    fileIds,
    isRead,
    aes_key
  }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteEmailId,
        ID.unique(),
        {
            sender_id,
            receiver_id,
            subject,
            body,
            fileIds,
            isRead,
            aes_key
        }
      );
    } catch (error) {
      console.log("error in createEmail::", error);
    }
  }

  async deleteEmail(mail,post_id) {
    if(mail.sender_id && mail.receiver_id)
    {
        const current_User = authService.getCurrentUser()
        if(current_User == mail.sender_id)
        {
            this.updateEmail({sender_id : 'not available',...mail})
        }
        else
        {
            this.updateEmail({receiver_id : 'not available',...mail})
        }
        /*see mail and make one undefined.....*/
        return
    }
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteEmailId,
        post_id
      );
      return true;
    } catch (error) {
      console.log("error in deleteMail::", error);
      return true;
    }
  }

  async getEmail({post_id}) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteEmailId,
        post_id
      );
    } catch (error) {
      console.log("error in getMail::", error);
      return false;
    }
  }

  async getEmailsWithSenderId({userId , queries = []}) {
    console.log('id = ',userId)
    //queries = [Query.equal("sender_id",String(userId))]
    try {

      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteEmailId,
        //queries
      );
    } catch (error) {
      console.log("error in getMails::", error);
      return false;
    }
  }

  async getEmailsWithReceiverId({userId , queries = []}) {
    console.log('id = ',userId)
    //queries = [Query.equal("receiver_id",String(userId))]
    try {

      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteEmailId,
        //queries
      );
    } catch (error) {
      console.log("error in getMails::", error);
      return false;
    }
  }

  //file upload service

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("error in uploadFile::", error);
      return false;
    }
  }

  async delteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
    } catch (error) {
      console.log("error in deleteDile::", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    if (fileId.fileId) fileId = fileId.fileId;
    return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
  }

  async getFileDetails(fileId) {
    try {
        const file = await this.bucket.getFile(conf.appwriteBucketId, fileId);
        const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${conf.appwriteBucketId}/files/${fileId}/view?project=${conf.appwriteProjectId}&mode=admin`;


        //console.log("file name = : ",file.name)

        return {
            id : fileId ,
            name: file.name,
            url: fileUrl, // Returning content for further use
        };
    } catch (error) {
        console.log("Error in getFileDetails::", error);
        return null;
    }
  }


  //get user details...

  async setUserDetails( {user_id, mail , public_key , password} ) {
    console.log('in set user ' ,user_id , mail , public_key , password)
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUserDataId,
        user_id,
        {
          password,
          mail,
          public_key
        }
      );
    } catch (error) {
      console.log("error in setUserdetails::", error);
    }
  }

  async getUserDetails(user_id) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUserDataId,
        user_id
      );
    } catch (error) {
      console.log("error in getPost::", error);
      return false;
    }
  }

  async getUserDetailswithmail({ mail }) {
    console.log("Searching for mail:", mail);
    try {
        const response = await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteUserDataId,
            [Query.equal("mail", mail)]  // ✅ Query for the document
        );

        if (response.documents.length === 1) {
            return response.documents[0];  // ✅ Return the only document
        } else {
            console.log("User not found or multiple users exist with this email.");
            return null;
        }
    } catch (error) {
        console.error("Error in getUserDetailsWithMail:", error);
        return false;
    }
  }

}

const service = new Service();

export default service;
