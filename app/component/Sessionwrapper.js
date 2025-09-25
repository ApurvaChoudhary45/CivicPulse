'use client'
import React from 'react'
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs"
const Sessionwrapper = ({children}) => {
  console.log("siteUrl:", process.env.NEXT_PUBLIC_KINDE_SITE_URL);
  return (
    <div>
      <KindeProvider clientId={process.env.NEXT_PUBLIC_KINDE_CLIENT_ID} // your prod client id
      redirectUri={process.env.NEXT_PUBLIC_KINDE_REDIRECT_URI} // https://civic-pulse-eight.vercel.app/api/auth/kinde_callback
      issuer={process.env.NEXT_PUBLIC_KINDE_ISSUER_URL} // https://webdev1717.kinde.com
      siteUrl={process.env.NEXT_PUBLIC_KINDE_SITE_URL}>
        {children}
      </KindeProvider>
    </div>
  )
}

export default Sessionwrapper
