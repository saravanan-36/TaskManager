import React, { useContext } from 'react'
import{BrowserRouter as Router, Route, Routes, Outlet, Navigate} from 'react-router-dom'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Dashboard from './pages/Admin/Dashboard'
import ManageTasks from './pages/Admin/ManageTasks'
import CreateTask from './pages/Admin/CreateTask'
import ManageUsers from './pages/Admin/ManageUsers'
import UserDashboard from './pages/User/UserDashboard'
import MyTasks from './pages/User/MyTasks'
import ViewTaskDetails from './pages/User/ViewTaskDetails'
import PrivateRoute from './routes/PrivateRoute'
import UserProvider, { UserContext } from './context/userContext'
import { Toaster } from 'react-hot-toast'


const App = () => {
  return (
    <UserProvider>
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
         
         {/* admin routes */}
         <Route element={<PrivateRoute allowedRoles={['admin']} />}>
           <Route path="/admin/dashboard" element={<Dashboard />} />
           <Route path="/admin/tasks" element={<ManageTasks/>}/>
           <Route path="/admin/create-tasks" element={<CreateTask/>}/>
            <Route path="/admin/users" element={<ManageUsers/>}/>
         </Route>
          {/* user routes */}
          <Route element={<PrivateRoute allowedRoles={['user']} />}>
           <Route path="/user/dashboard" element={<UserDashboard />} />
           <Route path="/user/tasks" element={<MyTasks/>}/>
           <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
         </Route>

        {/* degault user */}
        <Route path='/' element={<Root/>}/>
        </Routes>
      </Router>
    </>
    <Toaster 
    toastOptions={{
      className: '',
      style:{
        fontSize: '13px',
      },
    }}

    />
    </UserProvider>
  )
}

export default App;


const Root=()=>{
  const {user,loading}=useContext(UserContext);
  if (loading) 
    return <Outlet/>
  if (!user) {
    return <Navigate to="login" />
  }

  return user.role === "admin" ? <Navigate to="/admin/dashboard"/>:<Navigate to="/user/dashboard" />
}