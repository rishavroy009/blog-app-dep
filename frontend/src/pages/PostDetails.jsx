import React, { useContext, useEffect, useState } from 'react'
import Footer from '../components/Footer'
import {BiEdit} from 'react-icons/bi'
import {MdDelete} from 'react-icons/md'
import Comment from '../components/Comment'
import axios from 'axios'
import {URL,IF} from '../url'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import Loader from '../components/Loader'
import Navbar from '../components/Navbar'
const PostDetails = () => {
  const postId=useParams().id
  const [post,setPost]=useState({})
  const {user}=useContext(UserContext)
  const [loader,setLoader]=useState(false)
  const navigate=useNavigate()
  const fetchPost=async()=>{
    setLoader(true)
    try{
      const res= await axios.get(URL+"/api/posts/"+postId)
      // console.log(res.data)
      setPost(res.data)
      setLoader(false)
    }
    catch(err){
      console.log(err)
      setLoader(true)
    }
  }
  useEffect(()=>{
    fetchPost()

  },[postId])

  const handleDeletePost=async ()=>{

    try{
      const res=await axios.delete(URL+"/api/posts/"+postId,{withCredentials:true})
      // console.log(res.data)
      navigate("/")

    }
    catch(err){
      console.log(err)
    }

  }


  return (
    <div>
      
     <Navbar/>
    
    {loader?<div className='h-[80vh] flex justify-center items-center w-full'><Loader/></div>:
      <div className="px-8 md:px-[200px] mt-8">
<div className="flex justify-between items-center">
<h1 className='text-2xl font-bold text-black md:text-3xl'>
{post.title}
</h1>
{user?._id===post?.userId && 
  <div className='flex items-center justify-center space-x-2'>
<p onClick={()=>navigate("/edit/"+postId)}><BiEdit className='cursor-pointer'/></p>
<p onClick={handleDeletePost}><MdDelete className='cursor-pointer'/></p>
</div>}

</div>
<div className='flex items-center justify-between mt-2 md:mt-4'>
<p>@{post.username}</p>
    <div className='flex space-x-2'>
    <p>{new Date(post.updatedAt).toString().slice(0,15)}</p>
       <p>{new Date(post.updatedAt).toString().slice(16,21)}</p>
    </div>

</div>
<img src={IF+post.photo} className='w-full mx-auto mt-8 h-[60vh] object-cover rounded-md' alt='image file not available'/>
<p className='mx-auto mt-8'>
{post.desc}
</p>
<div className='flex items-center mt-8 space-x-4 font-semibold'>
  <p>Categories:</p>
  <div className='flex justify-center items-center space-x-2 '>
  {post.categories?.map((c,i)=>(
            <>
            <div key={i} className="bg-gray-300 rounded-lg px-3 py-1">{c}</div>
            </>
            
          ))}
  </div>

</div>
<div  className='flex flex-col mt-4 '>
  <h3 className='mt-6 mb-4 font-semibold'>
     Comments:
  </h3>
  {/* comment */}
  
  <Comment/>
  <Comment/>
</div>
{/* write a comment */}
<div className='flex flex-col mt-4 md:flex-row w-full'>
<input type='text' placeholder='Write your thoughts' className='md:w-[90%] outline-none  border-b-[1px] border-gray-600 px-4 py-2 mt-4 md:mt-0 '/>
<button className='bg-black text-white px-4 py-2 md:w-[20%] mt-4 md:mt-0 hover:bg-gray-300 hover:text-black'>Add Comment</button>
</div>
</div>}


      <Footer/>
    </div>
  )
}

export default PostDetails