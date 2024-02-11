import { useEffect, useState } from 'react'
import {Routes, Route, useNavigate} from 'react-router-dom'
import routes from './routes'
import Login from './components/Login'
import Layout from './components/layout/Layout'
import _Form from "./components/dashboard/_Form";
import {MantineProvider} from "@mantine/core";
import {ModalsProvider} from "@mantine/modals";
import Dashboard from "./components/dashboard/Dashboard";
import _AnotherFormLayout from "./components/dashboard/_AnotherFormLayout";
import _Datatable from "./components/dashboard/_Datatable";
import Crud from "./components/dashboard/Crud";
import SampleDashboard from "./components/modules/sample-module/Dashboard";
import './lang/i18next';



function App() {



    const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    {token ? navigate('/') : navigate('/login')}
  }, [])
  return (


      <MantineProvider withNormalizeCSS withGlobalStyles>
          <ModalsProvider>
                  <Routes>
                      <Route path='/login' element={<Login/>}/>

                      <Route path="/" element={<Layout/>}>
                          <Route path="/sample/">
                              <Route path="" element={<SampleDashboard/>}/>
                          </Route>

                          <Route path="/crud" element={<Crud/>}/>
                          <Route path="/stock" element={<Dashboard/>}/>
                          <Route path="/form" element={<_Form/>}/>
                          <Route path="/another" element={<_AnotherFormLayout/>}/>
                          <Route path="/datatable" element={<_Datatable/>}/>
                      </Route>
                  </Routes>
          </ModalsProvider>
      </MantineProvider>
    
        /*<Routes>
          <Route path='/login' element={<Login />} />

          {
            routes.map((route, index) => (
              <Route key={route.path} element={<Layout />}>
                <Route path={route.path} element={<route.component />} />
              </Route>
            ))
          }
        </Routes>*/
     
  )
}

export default App
