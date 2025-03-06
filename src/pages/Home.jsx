import {useState,useEffect} from 'react'
import service from '../backend/config'
import { Container,EmailCard} from '../components'
import { useSelector } from 'react-redux'

function Home() {

    const [posts,setPosts] = useState([])
    const userData = useSelector(state => state.userData)
    
    useEffect(() =>{
        // service.getPosts().then((posts) =>{
        //     if(posts)
        //     {
        //         setPosts(posts.documents)
        //     }
        // })
    },[userData,posts])
    
    
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
                    {posts.map((post) => (
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