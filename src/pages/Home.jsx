import {useState,useEffect} from 'react'
import service from '../backend/config'
import { Container,EmailCard} from '../components'
import { useSelector } from 'react-redux'
//import RSA from '../cryptography/rsa'
function Home() {

    const [sentposts,setSentPosts] = useState([])
    const [recvposts,setRecvPosts] = useState([])
    const { userData } = useSelector(state => state.userData) || {undefined}
    
    const getposts = async () => {
        //console.log('userData:', userData);
        //const {encryptedMessage , decryptedMessage} = await RSA("nippura u ppura ")
        //console.log('enc',encryptedMessage)
        //console.log('dec',decryptedMessage)
        if (userData) { 
            //const post_id = "67cc463600113e4b0f7a";
            
            try {
                // Fetch single post by ID
                const sentPosts = await service.getEmailsWithSenderId({userId:userData.$id});
                
                setSentPosts(sentPosts.documents);  // Update state
    
                //console.log('Sent Post:', sentPosts); // Log immediately after fetching
                
                // Fetch received posts
                const receivedPosts = await service.getEmailsWithReceiverId({ userId: userData.$id });
                setRecvPosts(receivedPosts.documents); // Update state
    
                //console.log('Received Posts:', receivedPosts.documents);
                
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        }
    };
    
    // Call the function inside `useEffect` to avoid re-renders
    useEffect(() => {
        getposts();
    }, [userData]);  // Runs only when `userData` changes
    
    
    
    if (!userData) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8'>
            <Container>
                 <div className='flex flex-wrap'>
                    {sentposts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <EmailCard {...post} id = {post.$id} />
                        </div>
                    ))}
                    {recvposts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <EmailCard {...post} id = {post.$id} />
                        </div>
                    ))}
                </div> 
            </Container>
        </div>
    )
}

export default Home