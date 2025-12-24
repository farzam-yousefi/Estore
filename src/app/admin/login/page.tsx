import AdminLoginForm from '@/components/admin-login-form';
import CozyClosetLogo from '@/components/cozy-closet-logo'
import { Metadata } from 'next';
import { Suspense } from 'react';
 export const metadata: Metadata = {
  title: 'Admin Login',
};
export default function AdminLoginPage() {
  return (
     <div className="container w-1/2">
      <div className="flex h-20 w-full items-center rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <CozyClosetLogo />
          </div>
        </div>
      <h1 className="mt-5 text-3xl text-black">Please log in to continue</h1>
      
        <Suspense>
          <AdminLoginForm  />
        </Suspense>
      
    </div>
  );
}