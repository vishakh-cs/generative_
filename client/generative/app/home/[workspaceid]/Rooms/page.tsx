import Loaders from '@/components/Loaders/page'
import Room from '@/components/Room/page'
import React from 'react'

function Rooms({params}) {
  return (
    <div>
        <Room
        roomId={params.workspaceid} 
        fallback={<Loaders />} />
    </div>
  )
}

export default Rooms;