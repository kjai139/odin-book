'use client'

import { useEffect } from "react";
import { useAuth } from "../../context/authContext";
import HomeFooter from "./_components/homeFooter";
import HomeLogin from "./_components/homeLogin";


export default function Home() {

  const { isAuthenticated, doneLoading } = useAuth()

  useEffect(() => {
    isAuthenticated()
  }, [])


  return (
    <div className="home-grid">
      
    <main className="flex justify-center items-center bg-login-bg w-screen flex-col">
      <div className="flex login-wrap">
        <div className="flex-1">
        <h1 className="ht">Openchat</h1>
        <p>It's like facebook but not really.</p>
        </div>
        <HomeLogin></HomeLogin>
        
      </div>
      
    </main>
      <HomeFooter></HomeFooter>
    </div>
    
  )
}


{/* <div className="fb-login-button" data-width="" data-size="" data-button-type="" data-layout="" data-auto-logout-link="false" data-use-continue-as="false"></div> */}