import React,{useEffect,useRef,useState} from 'react'
import Avatar from './Avatar'
import DefaultPage from './DefaultPage'
import {uniqBy} from 'lodash'
import axios from 'axios'
import Contact from './Contact'
import Logo from './Logo'

function ChatPage({currentUser}) {

  const [ws,setWs]=useState(null) 
  const [onlineFriends,setOnlineFriends]=useState({}) 
  const [offlineFriends,setOfflineFriends]=useState({})
  const [selectedUserId,setSelectedUserId]=useState(null)
  const [newMessage,setNewMessage]=useState('')
  const [messages,setMessages]=useState([])
  const [searchBar,setSearchBar]=useState(false)
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
  
    const messageData=JSON.parse(ev.data)
    
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

    //for showing searchbar
    function handleClick(e){
      if(searchBar)setSearchBar(false);
    }

    //auto scroll to down every time
    useEffect(()=>{
      const div=messageRef.current;
      if(div){
        div.scrollIntoView({behavior:'smooth',block:'end'});
      }
    },[messages])

    //handling logout 
    function handleLogout(){
      //this will close the connection between this client and server.
      ws.close()

      axios.get('/user/logout').then((res)=>{
        //this will reload the page
        window.location.reload(true);
      })
    }
    
    //finding online and offline users and use them to show them.
    useEffect(()=>{
     axios.get('/allusers').then((res)=>{
       const {data}=res
       
      const offlineUsersarr= data.filter( friend =>{  
        return friend._id !== currentUser.id
       })
       .filter( friend =>{
        return !Object.keys(onlineFriends).includes(friend._id)
       })

       const offlineUsers={};
       offlineUsersarr.forEach(friend => {
        offlineUsers[friend._id]=friend.userName
       })

       setOfflineFriends(offlineUsers)
    })
    },[onlineFriends])

    //eastablishing the connection if it is closed
    useEffect(()=>{
    ConnectToWs()
    },[])
   
    // setting the messages after fetching it form backend server 
    useEffect(()=>{
     if(selectedUserId){
      axios.get('/message/'+selectedUserId).then((res)=>(
        setMessages(res.data)
      ))
     }
    },[selectedUserId])


    // removing duplicate messages
    const messagesWithoutDupes=uniqBy(messages,'_id')

  return (
    <div className='h-screen w-screen flex'>
     <div className='w-1/4 bg-white flex flex-col' onClick={e => handleClick(e)}>
     <div className='flex-grow'>
     <div className='bg-red-500 py-4 px-3  flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
         <Logo />
         <div className='text-white px-4' onClick={ e => setSearchBar(!searchBar)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
           <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
         </svg>
         </div>
       </div>
       <div className={'w-full' + (!searchBar && ' hidden')}>
       <input 
        type='text'
        placeholder='Search'
        className='rounded-md outline-none p-2 w-full'
       />
       </div>
     </div>
     <div className='w-full flex flex-col'>
      {Object.keys(onlineFriends).filter( id => id !== currentUser.id).map( userId =>(
        <Contact 
        key={userId}
        userId={userId}
        setSelectedUserId={setSelectedUserId}
        username={onlineFriends[userId]}
        online={true}
        />
      )) }
      {Object.keys(offlineFriends).map( userId =>(
        <Contact 
        key={userId}
        userId={userId}
        setSelectedUserId={setSelectedUserId}
        username={offlineFriends[userId]}
        online={false}
        />
      )) }
     </div>
     </div>
     <div className='bg-red-100 px-2 py-4 flex items-center justify-between'>
      <div className='px-4 flex items-center gap-1'>
      <Avatar
      userName={currentUser.userName}
      userId={currentUser.id}
      online={true}
       />
       <span >{currentUser.userName}</span>
      </div>
      <div className='px-2' onClick={handleLogout}>
       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
       </svg>
      </div> 
      </div>
     </div>
      
     <div className='w-3/4 bg-red-50'>
       {!selectedUserId === true ?
        <DefaultPage />
        :
        <div className='w-full h-full flex flex-col '>
           {/* nav-bar for message part */}
           <div className='w-full py-4 bg-red-400 flex items-center gap-3 px-3'>
             <div className='flex-grow flex items-center gap-2'> 
               <Avatar 
               userId={selectedUserId}
               userName={Object.keys(onlineFriends).includes(selectedUserId) ? onlineFriends[selectedUserId] : offlineFriends[selectedUserId]}
               online={Object.keys(onlineFriends).includes(selectedUserId)}
                />
               <span>{Object.keys(onlineFriends).includes(selectedUserId) ? onlineFriends[selectedUserId] : offlineFriends[selectedUserId]}</span>
             </div>
             <div className='p-2 bg-red-200 rounded-full'>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
               </svg>
             </div>
             <div className='p-2 bg-red-200 rounded-full'>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
               </svg>
             </div>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
               </svg>
          </div>

        {/* here i want to show all the messages for that i used here flex-grow which will take all the 
        remaining space */}
         <div className='flex-grow px-2 flex flex-col gap-2'> 

         {/* here i put relative to the parent element so i can put messages here so that when we scroll 
         the message will move with it */}
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-2 left-0 right-0 bottom-2">
              <div className='pr-2'>
              {messagesWithoutDupes.map(msg =>(
                <div key={msg._id} className={(msg.sender === currentUser.id ? 'text-right' : 'text-left') + ' py-[2px]'}>
                {/* <div className={(msg.sender !== currentUser.id ? 'bg-white ' : 'bg-red-300 ')+ 'text-left max-w-[60%]'}>{onlineFriends[msg.sender]}</div> */}
                <div
                className={(msg.sender !== currentUser.id ? 'bg-white ' : 'bg-red-300 ') + 'inline-block text-left p-2 rounded-md max-w-[60%]'}
                >
                {/* <Avatar userId={msg.sender} userName={onlineFriends[msg.sender]}/> */}
                {msg.text}
                </div>
                </div>
              ))}
              </div>
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
