import LoginForm from '@/components/login-form';
import { Metadata } from 'next';
import { Suspense } from 'react';
 export const metadata: Metadata = {
  title: 'Login',
};
export default function LoginPage() {
  return (
     <div className="container w-1/2">
     
      <h1 className="title">Loggin</h1>
        <Suspense>
          <LoginForm  />
        </Suspense>
      </div>
   
  );
}