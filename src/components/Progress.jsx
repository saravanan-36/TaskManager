import React from 'react'

const Progress = ({progress,status}) => {
    const getColor = () => {
        switch(status){
            case "Completed" : return "text-green-500 bg-green-100 border border-green-200";
            case "Pending" : return "text-purple-500 bg-purple-100 border border-purple-200";
            case "In Progress" : return "text-cyan-500 bg-cyan-100 border border-cyan-200";
            default  : return "text-gray-500 bg-gray-100 border border-gray-200";
        }
    }
  return (
    <div className='w-full bg-gray-200 rounded-full h-1.5'>
        <div className={`${getColor()} h-1.5 rounded-full text-center text-xs font-medium `} style={{width:`${progress}%`}}>
            
        </div>
    </div>
  )
}

export default Progress