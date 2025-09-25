'use client'
import React from 'react'
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs"
const Sessionwrapper = ({children}) => {
  return (
    <div>
      <KindeProvider>
        {children}
      </KindeProvider>
    </div>
  )
}

export default Sessionwrapper
