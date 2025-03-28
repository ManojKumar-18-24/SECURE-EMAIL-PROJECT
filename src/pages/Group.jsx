import { useState, useEffect } from "react";
import service from "../backend/config";
import { Container, EmailCard } from "../components";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import EmailForm from "../components/EmailForm";

function Group() {
  const [groupposts, setGroupPosts] = useState([]);
  const { userData } = useSelector((state) => state.userData) || { undefined };
  const { id } = useParams();

  const getposts = async () => {
    //console.log("userData:", userData);

    if (userData) {
      //const post_id = "67cc463600113e4b0f7a";

      try {
        // Fetch single post by ID
        const groupPosts = await service.getEmailsWithGroupId({ groupId: id });

        setGroupPosts(groupPosts.documents); // Update state

        //console.log("Sent Post:", groupPosts); // Log immediately after fetching

        // Fetch received posts
        // const receivedPosts = await service.getEmailsWithReceiverId({ userId: userData.$id });
        // setRecvPosts(receivedPosts.documents); // Update state

        // console.log('Received Posts:', receivedPosts.documents);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
  };

  // Call the function inside `useEffect` to avoid re-renders
  useEffect(() => {
    getposts();
  }, [userData]); // Runs only when `userData` changes

  if (!userData) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">Login</h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <>
      <div className="w-full py-8">
        <Container>
          <div className="flex flex-wrap">
            {groupposts.map((post) => (
              <div key={post.$id} className="p-2 w-1/4">
                <EmailCard {...post} id={post.$id} />
              </div>
            ))}
          </div>
          <EmailForm groupId={id} to={false}/>
        </Container>
      </div>
    </>
  );
}

export default Group;
