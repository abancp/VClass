import React,{useEffect} from 'react'
import ClassCard from '../sub/ClassCard'

function ClassGrid({ classes, publicClasses }) {
  useEffect(() => { console.log(publicClasses) }, [])
  return (
    <div className='grid gap-8 p-10 justify-items-start grid-cols-1 pb-40 md:grid-cols-2 lg:grid-cols-3  w-full h-full'>
      {
        classes.map((data) => (<ClassCard publicClasses={publicClasses} {...data} />))
      }

    </div>
  )
}

export default ClassGrid
