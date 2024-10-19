import React,{useEffect,useRef,useState} from 'react'
import Avatar from './Avatar'
import LeftChatPage from './LeftChatPage'
import ChatPageRightHeader from './ChatPageRightHeader'
import DefaultPage from './DefaultPage'
import {uniqBy} from 'lodash'
import axios from 'axios'

function ChatPage({currentUser}) {

  const [ws,setWs]=useState(null) 
  const [onlineFriends,setOnlineFriends]=useState({}) 
  const [selectedUserId,setSelectedUserId]=useState(null)
  const [newMessage,setNewMessage]=useState('')
  const [messages,setMessages]=useState([])
  const messageRef=useRef()

  // console.log(currentUser);
  
  function showOnlinePeople(peopleArray){
    const onlinePeople={}
    // console.log(peopleArray);
    peopleArray.forEach(({id,userName})=>{
      onlinePeople[id]=userName
    })
   
    setOnlineFriends(onlinePeople)
    
  }
  
  const handleMessages=(ev)=>{
    // console.log(ev);
    
    const messageData=JSON.parse(ev.data)
    // console.log(messageData);
    
    
    if('online' in messageData){
      showOnlinePeople(messageData.online) 
    }
    else if('text' in messageData){
      const {text,_id,recipent,sender}=messageData
      setMessages(prev => ([...prev,{
        text:text,
        isOur:false,
        senderID:sender,
        recipentId:recipent,
        _id
      }]))
      
    } 
  }

    function ConnectToWs(){
      const ws= new WebSocket(import.meta.env.VITE_WS_URL)

     setWs(ws)

     ws.addEventListener('message',handleMessages)
     ws.addEventListener('close',()=>(
      setTimeout(()=>(
        ConnectToWs()
      ),1000)
     ))
    }

    function handleSendMessage(e){
     e.preventDefault();

     console.log('sending',"-->",{newMessage});
     
     ws.send(JSON.stringify({
      recipent:selectedUserId,
      text:newMessage
     }))
     setMessages( prev => ([...prev,{
      text:newMessage,
      isOurs:true,
      sender:currentUser.id,
      recipent:selectedUserId,
      _id:Date.now()
    }]))
     setNewMessage('');
    }

    //auto scroll to down every time
    useEffect(()=>{
      const div=messageRef.current;
      if(div){
        div.scrollIntoView({behavior:'smooth',block:'end'});
      }
    },[messages])
    
    //eastablishing the connection if it is closed
    useEffect(()=>{
    ConnectToWs()
    },[])
   
    // setting the messages after fetching it form backend server 
    useEffect(()=>{
     if(selectedUserId){
      axios.get('/message/'+selectedUserId).then((res)=>(
        setMessages(res.data)
        // console.log(res.data)
      ))
     }
    },[selectedUserId])
    const messagesWithoutDupes=uniqBy(messages,'_id')

  return (
    <div className='h-screen w-screen flex'>
     <LeftChatPage onlineFriends={onlineFriends} setSelectedUserId={setSelectedUserId} currentUser={currentUser} selectedUserId={selectedUserId} />
      
     <div className='w-3/4 bg-red-50'>
       {!selectedUserId === true ?
        <DefaultPage />
        :
        <div className='w-full h-full flex flex-col '>
           {/* nav-bar for message part */}
          <ChatPageRightHeader onlineFriends={onlineFriends} selectedUserId={selectedUserId} />


        {/* here i want to show all the messages for that i used here flex-grow which will take all the 
        remaining space */}
         <div className='flex-grow px-2 flex flex-col gap-2'> 

         {/* here i put relative to the parent element so i can put messages here so that when we scroll 
         the message will move with it */}
            <div className="relative h-full">

              <div className="overflow-y-scroll absolute top-2 left-0 right-0 bottom-2">
              {messagesWithoutDupes.map(msg =>(
                <div key={msg._id} className={(msg.sender === currentUser.id ? 'text-right' : 'text-left') + ' py-2'}>
                {/* <div className={(msg.sender !== currentUser.id ? 'bg-white ' : 'bg-red-300 ')+ 'text-left max-w-[60%]'}>{onlineFriends[msg.sender]}</div> */}
                <div
                className={(msg.sender !== currentUser.id ? 'bg-white ' : 'bg-red-300 ') + 'inline-block text-left p-2 rounded-md max-w-[60%]'}
                >
                {/* <Avatar userId={msg.sender} userName={onlineFriends[msg.sender]}/> */}
                {msg.text}
                </div>
                </div>
              ))}
              <div ref={messageRef}></div>
             </div>
           </div>
         </div>


        <div className='flex w-full gap-3 pb-3 px-3'>
        {/* footer for message part */}
        <div className='bg-red-200 rounded-md p-2 '>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
        </svg>
        </div>
        <div className='bg-red-200 rounded-md p-2'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        </div>
        <form 
        onSubmit={handleSendMessage}
        className='w-full flex gap-3 '>
        <input
         value={newMessage}
         type="text"
         className=' flex-grow outline-none px-2 rounded-md'
         placeholder='Type your message '
         onChange={ e => setNewMessage(e.target.value)}
         /> 
         <button 
           type='submit'
         className='text-white bg-red-600 rounded-md px-4 py-2'
         >
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
         </svg>
         </button>
        </form>
        </div>
      </div>
      }
      </div>
    </div>
  )
}

export default ChatPage
