import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";
import authService from "./auth";
import { nanoid } from "@reduxjs/toolkit";
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
    groupId = " ",
    subject,
    body,
    fileIds,
    isRead,
    aes_key,
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
          aes_key,
          groupId
        }
      );
    } catch (error) {
      console.log("error in createEmail::", error);
    }
  }

  async deleteEmail(mail, post_id) {
    if (mail.sender_id && mail.receiver_id) {
      const current_User = authService.getCurrentUser();
      if (current_User == mail.sender_id) {
        this.updateEmail({ sender_id: "not available", ...mail });
      } else {
        this.updateEmail({ receiver_id: "not available", ...mail });
      }
      /*see mail and make one undefined.....*/
      return;
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

  async getEmail({ post_id }) {
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

  async getEmailsWithSenderId({ userId, queries = [] }) {
    console.log('sender id = ',userId)
    queries = [Query.equal("sender_id", String(userId))];
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

  async getEmailsWithReceiverId({ userId, queries = [] }) {
    console.log('receiver id = ',userId)
    queries = [Query.equal("receiver_id", String(userId))];
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

  async getFileDetails(fileId) {
    try {
      const file = await this.bucket.getFile(conf.appwriteBucketId, fileId);
      const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${conf.appwriteBucketId}/files/${fileId}/view?project=${conf.appwriteProjectId}&mode=admin`;

      //console.log("file name = : ",file.name)

      return {
        id: fileId,
        name: file.name,
        url: fileUrl, // Returning content for further use
      };
    } catch (error) {
      console.log("Error in getFileDetails::", error);
      return null;
    }
  }

  //get user details...

  async setUserDetails({ user_id, mail, public_key, password }) {
    console.log("in set user ", user_id, mail, public_key, password);
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUserDataId,
        user_id,
        {
          password,
          mail,
          public_key,
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
        [Query.equal("mail", mail)] // ✅ Query for the document
      );

      if (response.documents.length === 1) {
        return response.documents[0]; // ✅ Return the only document
      } else {
        console.log("User not found or multiple users exist with this email.");
        return null;
      }
    } catch (error) {
      console.error("Error in getUserDetailsWithMail:", error);
      return false;
    }
  }

  // Group functions...

  async getGroups({ userId, queries = [] }) {
    console.log('in groups: ',userId)
    queries = [Query.equal("userId", String(userId))];
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteGroupsId,
        queries
      );
    } catch (error) {
      console.log("error in getgroups::", error);
      return false;
    }
  }

  async createGroup(groupData) {
    try {
      //const grpId = nanoid();
      // Iterate over members and create documents for each user
      const promises = groupData.members.map(async (member) => {
        // Create document for each user
        const response = await this.databases.createDocument(
          conf.appwriteDatabaseId,
          conf.appwriteGroupsId,
          ID.unique(),
          {
            groupId: groupData.groupId,
            userId: member.userId,
            groupName: groupData.groupName,
            //isAdmin: member.isAdmin,
          }
        );
        return response;
      });

      // Wait for all document creation requests to complete
      const results = await Promise.all(promises);
      console.log("Group documents created:", results);

      return { success: true, data: results };
    } catch (error) {
      console.error("Error creating group:", error);
      return { success: false, error: error.message };
    }
  }

  async getEmailsWithGroupId({ groupId, queries = [] }) {
    console.log('receiver id = ',groupId)
    queries = [Query.equal("groupId", String(groupId))];
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
  
  async addMember({ userId, groupName, isAdmin }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteGroupsId,
        ID.unique(),
        {
          userId,
          groupName,
          isAdmin,
        }
      );
    } catch (error) {
      console.log("error in Addmember::", error);
    }
  }

  async removeMember({ id }) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteGroupsId,
        id
      );
    } catch (error) {
      console.log("error in deletemember::", error);
    }
  }

  async getAESKEY({mailId,userId ,queries = []}){
    console.log('userid in getaeskey: ',userId)
    console.log('mailid in getaeskey: ',mailId)
    queries = [
      Query.equal("mailId", mailId),
      Query.equal("userId", userId)
    ];
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteGroupsDataId,
        queries
      );
    } catch (error) {
      console.log("error in getgroups::", error);
      return false;
    }
  }

  async getGroupUsers({grpId , queries = []}){
    console.log('in groups: ',grpId)
    queries = [Query.equal("groupId", String(grpId))];
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteGroupsId,
        queries
      );
    } catch (error) {
      console.log("error in getgroups::", error);
      return false;
    }    
  }

  async putAESKEY({ grpId, mailId, aes_key }) {
    try {
      // Fetch group users
      const users = await this.getGroupUsers({ grpId });
      const user_docs = users.documents;
      console.log('user docs',users)
      // Loop through each user document
      for (const user of user_docs) {
        const userId = user.userId; // Extract userId from each document
  
        // Add each record to the table
        await this.databases.createDocument(
          conf.appwriteDatabaseId, // Replace with your database ID
          conf.appwriteGroupsDataId, // Replace with your collection ID
          ID.unique(), // Auto-generate a unique ID
          {
            mailId: mailId,      // Insert mailId
            userId: userId,      // Insert userId from each object
            aes_key: aes_key,    // Insert aes_key
          }
        );
  
        //console.log(`Inserted AES key for user ${userId}`);
      }
  
      console.log("All AES keys inserted successfully!");
    } catch (error) {
      console.error("Error inserting AES keys:", error);
    }
  }
  
}

const service = new Service();

export default service;
