import { useEffect, useState } from 'react'
import {Routes, Route, useNavigate} from 'react-router-dom'
import routes from './routes'
import Login from './components/Login'
import Layout from './components/layout/Layout'

function App() {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    {token ? navigate('/') : navigate('/login')}
  }, [])
  return (
    
        <Routes>
          <Route path='/login' element={<Login />} />

          {
            routes.map((route, index) => (
              <Route key={route.path} element={<Layout />}>
                <Route path={route.path} element={<route.component />} />
              </Route>
            ))
          }
        </Routes>
     
  )
}

export default App
