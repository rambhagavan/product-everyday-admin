import React from 'react'
import Layout from './Layout/Layout'
import { AdminAuthGuard } from "../../auth/AuthGuard";

const AppLayout = ({ children }) => {
  return (
    <AdminAuthGuard>
      <Layout>
        {children}
      </Layout>
    </AdminAuthGuard>
  )
}

export default AppLayout