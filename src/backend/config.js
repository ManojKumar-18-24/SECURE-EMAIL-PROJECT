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
    description,
    files,
    isRead
  }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwritePostsId,
        ID.unique(),
        {
            sender_id,
            receiver_id,
            subject,
            description,
            files,
            isRead
        }
      );
    } catch (error) {
      console.log("error in createEmail::", error);
    }
  }

  async updateEmail({
    sender_id,
    receiver_id,
    subject,
    description,
    files,
    isRead
  }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwritePostsId,
        ID.unique(),
        {
            sender_id,
            receiver_id,
            subject,
            description,
            files,
            isRead
        }
      );
    } catch (error) {
      console.log("error in updateEmail::", error);
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
        conf.appwritePostsId,
        post_id
      );
      return true;
    } catch (error) {
      console.log("error in deleteMail::", error);
      return true;
    }
  }

  async getEmail(post_id) {
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

  async getEmails(userId , queries = []) {
    queries = [Query.equal("userId",userId)]
    try {

      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteEmailId,
        queries
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

  //get user details...

  async setUserDetails( user_id, email , public_key ) {
    // console.log(user_id , email)
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUserDataId,
        user_id,
        {
          email,
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

  async getUserDetailswithmail(email) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUserDataId,
        Query.equal("email",email)
      );
    } catch (error) {
      console.log("error in getDetailswithmail::", error);
      return false;
    }
  }
}

const service = new Service();

export default service;
