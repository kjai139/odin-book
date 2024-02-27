'use client'

import { useEffect } from "react";
import { useAuth } from "../../context/authContext";
import HomeFooter from "./_components/homeFooter";
import HomeLogin from "./_components/homeLogin";
import axiosInstance from '.././../axios'
import { useRouter } from "next/navigation";


export default function Home() {

  const { isAuthenticated, doneLoading } = useAuth()
  const router = useRouter()

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
        if (response.status === 'connected') {
          console.log('user already connected')
          FB.api('/me', {fields: 'id, name, email, picture.type(normal)'}, function(response) {
            console.log('response from api', response)
          })
        } else {
          console.log('user is not connected')
        }
        console.log(response)
      })

    }

    initializeFacebookSDK()
    
  }, [])

  const testJwt = async () => {
    try {
      const response = await axiosInstance.post('/api/auth/testJwt')
      if (response.data.success) {
        console.log('CHECK JWT TOKEN')
      }

    } catch (err) {
      console.error(err)
    }
  }

  const loginAppFromFacebook = async (fbUser) => {
    try {
      const response = await axiosInstance.post('/api/auth/facebook/login', {
        username: fbUser.name,
        fbId: fbUser.id,
        email: fbUser.email,
        image: fbUser.picture.url,
        gender: fbUser?.gender
      }, {
        withCredentials: true
      })

      if (response.data.user) {
        console.log('Logged in from facebook')
        router.push('/dashboard')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const loginFacebook = () => {
    FB.getLoginStatus(function(response) {
      if (response.status !== 'connected') {
        console.log('Logging user in...')
        FB.login(function(response) {
          if (response.status === 'connected') {
            console.log('User is logged into FB')
            FB.api('/me', {fields: 'id, name, email, picture.type(normal), gender'}, function(response) {
              console.log('response from api', response)
              loginAppFromFacebook(response)
            })
          }
        }, {
          scope: 'public_profile, email'
        })
      } else if (response.status === 'connected') {
          FB.api('/me', {fields: 'id, name, email, picture.type(normal), gender'}, function(response) {
            console.log('response from api', response)
            loginAppFromFacebook(response)
          })
      }
    })
   
  }

  const logoutFacebook = () => {
    FB.logout(function(response) {
      console.log(response)
    })
  }

  


  


  return (
    <>
    
    <div className="home-grid">
      
    <main className="flex justify-center items-center bg-login-bg w-screen flex-col">
      <div className="flex login-wrap">
        <div className="flex-1">
        <h1 className="ht">Yappers</h1>
        <p>Yapp away with the world.</p>
        </div>
        <HomeLogin fbSignin={loginFacebook}></HomeLogin>
        {/* <div className="flex flex-col">
          
          <button onClick={testJwt}>TEST JWT</button>
        </div> */}
        
        
      </div>
      
      
    </main>
      <HomeFooter></HomeFooter>
    </div>
    </>
    
  )
}


{/* <div className="fb-login-button" data-width="" data-size="" data-button-type="" data-layout="" data-auto-logout-link="false" data-use-continue-as="false"></div> */}