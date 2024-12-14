import Nav from '../components/Navigation';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('/map');
  }, []);
  return <></>;
}
export default Home;
