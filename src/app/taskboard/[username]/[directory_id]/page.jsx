"use client"

import React from 'react'
import { useParams } from 'next/navigation';

const page = () => {
  const { directory_id } = useParams();  // Access the dynamic parameter

  return (
    <div className='w-screen h-screen bg-black'>
      <h1 class="text-white">This div takes up the full viewport width and height.</h1>
    </div>
  )
}

export default page