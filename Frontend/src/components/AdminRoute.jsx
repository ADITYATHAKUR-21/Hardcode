import React from 'react'

import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore} from '../store/useAuthStore'

export const AdminRoute = () => {
 const { authUser, isCheackingAuth} = useAuthStore()

    if (isCheackingAuth) {
      return <div className="flex items-center justify-center h-screen"><Loader className="size-10 animate-spin" /></div>;
    }

    if(!authUser || !authUser == "Admin"){
        return < Navigate to = "/"/>;
    }


  return <Outlet/>
}
