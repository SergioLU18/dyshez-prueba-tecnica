'use client'
import { redirect } from 'next/navigation';
import * as React from 'react';
import { logout, getUserEmail } from './actions';


const Home: React.FC = () => {

  const [email, setEmail] = React.useState("")

  React.useEffect(() => {
    getUserEmail().then((data) => {
      if (!data || typeof data !== 'string') {
        redirect('/login')
      }
      setEmail(data);
    })
  }, [])

  if(!email) return;

  return (
    <div>
      <p>
      Hello {email}
      </p>
      <button onClick={logout}>
        Logout
      </button>
    </div>
    )
}

export default Home;
