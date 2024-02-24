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

  useEffect(() => {
    
    const loadFacebookSDK = () => {
      return new Promise((resolve, reject) => {
      
        window.fbAsyncInit = function() {
          FB.init({
            appId      : '892340555959244',
            cookie     : true,
            xfbml      : true,
            version    : 'v18.0'
          });
            
          FB.AppEvents.logPageView();   
          resolve()
            
        };
      
        (function(d, s, id){
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {return;}
          js = d.createElement(s); js.id = id;
          js.src = "https://connect.facebook.net/en_US/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
      })
    }

    const initializeFacebookSDK = async () => {
      await loadFacebookSDK()
      FB.getLoginStatus(function(response) {
        console.log(response)
      })

    }

    initializeFacebookSDK()
    
  }, [])

  


  


  return (
    <div className="home-grid">
      
    <main className="flex justify-center items-center bg-login-bg w-screen flex-col">
      <div className="flex login-wrap">
        <div className="flex-1">
        <h1 className="ht">Yappers</h1>
        <p>Yapp away with the world.</p>
        </div>
        <HomeLogin></HomeLogin>
        
      </div>
      
    </main>
      <HomeFooter></HomeFooter>
    </div>
    
  )
}


{/* <div className="fb-login-button" data-width="" data-size="" data-button-type="" data-layout="" data-auto-logout-link="false" data-use-continue-as="false"></div> */}