"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";

export type UsersDetail = {
  name: string;
  email: string;
  credits: number;
};

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SessionProvider>
      <ProviderInner>{children}</ProviderInner>
    </SessionProvider>
  );
};

const ProviderInner = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [userDetail, setUserDetail] = useState<any>();
  
  useEffect(() => {
    if (session?.user) {
      setUserDetail({
        name: session.user.name,
        email: session.user.email,
        credits: 10,
      });
    }
  }, [session]);

  return (
    <div>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        {children}
      </UserDetailContext.Provider>
    </div>
  );
};

export default Provider;
