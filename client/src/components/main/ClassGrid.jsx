import axios from 'axios'
import React,{useEffect, useState} from 'react'
import { SERVER_URL } from '../../config/SERVER_URL'
import ClassCard from '../sub/ClassCard'

function ClassGrid() {
  const [classes,setClasses] = useState([])

  useEffect(() => {
    axios.get(SERVER_URL+"/class/classes",{withCredentials:true}).then(({data})=>{
      if(data.success){
        console.log(data)
        setClasses(data.classes)
      }
    }) 
  },[])

  return (
    <div className='grid gap-8 p-10 justify-items-start grid-cols-1 pb-40 md:grid-cols-2 lg:grid-cols-3  w-full h-full'>
      {
        classes.map((data) => (<ClassCard {...data} />))
      }

    </div>
  )
}

export default ClassGrid
