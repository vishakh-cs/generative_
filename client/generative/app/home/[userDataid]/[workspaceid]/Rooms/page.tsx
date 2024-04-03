"use client"
import Loaders from '@/components/Loaders/page'
import Room from '@/components/Room/page'
import React, { useEffect, useState } from 'react'

function Rooms({params}) {
  console.log("parAMMM",params)
  return (
    <div>
        <Room
        roomId={params.workspaceid} userId={params.userDataid}
        fallback={<Loaders />} />
    </div>
  )
}

export default Rooms;