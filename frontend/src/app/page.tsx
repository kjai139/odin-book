import HomeLogin from "./_components/homeLogin";


export default function Home() {
  return (
    <main className="flex justify-center items-center bg-login-bg h-screen w-screen">
      <div className="flex">
      <div className="flex-1">
      <h1 className="ht">Odinbook</h1>
      <h2>Connect with friends and the world around you on odinbook</h2>
      </div>
      <HomeLogin></HomeLogin>
      </div>
    </main>
  )
}


{/* <div className="fb-login-button" data-width="" data-size="" data-button-type="" data-layout="" data-auto-logout-link="false" data-use-continue-as="false"></div> */}