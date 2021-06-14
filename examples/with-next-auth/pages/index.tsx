import Head from 'next/head';
import { useSession, signIn, signOut } from 'next-auth/client';
import { useEffect, useState } from 'react';
import { User } from '../data';

const IndexPage = () => {
  const [session] = useSession();
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(res => {
        if (res.statusCode) {
          return;
        }

        setUsers(res);
      })
      .catch(err => alert(err.message));
  }, [])

  return (
    <div>
      <Head>
        <title>next-api-decorators example with next-auth</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {session && session.user
        ? <>
            <span>👋 Hello <strong>{session.user.name}</strong></span> <button onClick={() => signOut()}>Sign out</button>
          </>
        : <>
            <span>Please sign in</span> <button onClick={() => signIn()}>Sign in</button>
          </>
      }

      <hr />

    <h1>Users <sup>({users?.length ?? '?'})</sup></h1>

      {session &&
        <div>
          {users?.map(user =>
          <p>{user.name} ({user.email})</p>
          )}
        </div>
      }
    </div>
  );
};

export default IndexPage;
