import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.js'
import {Home , Login , Signup , AddEmail , Groups ,CreateGroup ,Group } from './pages'
import AuthLayout from './components/AuthLayout.jsx'
import EmailViewer from './pages/EmailViewer.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: (
                <AuthLayout authentication>
                    <Home/>
                </AuthLayout>
            )
        },
        {
            path: "/login",
            element: (
                <AuthLayout authentication={false}>
                    <Login />
                </AuthLayout>
            ),
        },
        {
            path: "/signup",
            element: (
                <AuthLayout authentication={false}>
                    <Signup />
                </AuthLayout>
            ),
        },
        {
            path: "/add-email",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <AddEmail />
                </AuthLayout>
            ),
        },
        {
            path:'/emails/:id',
            element : (
                <AuthLayout authentication>
                    <EmailViewer/>
                </AuthLayout>
            )
        },
        {
            path:'/groups',
            element : (
                <AuthLayout authentication>
                    <Groups/>
                </AuthLayout>
            )
        },
        {
            path:'/create-group',
            element : (
                <AuthLayout authentication>
                    <CreateGroup/>
                </AuthLayout>
            )
        },
        {
            path:'/groups/:id',
            element : (
                <AuthLayout authentication>
                    <Group/>
                </AuthLayout>
            )
        },
        {
            path:'/groups/:grpid/emails/:id',
            element : (
                <AuthLayout authentication>
                    <EmailViewer/>
                </AuthLayout>
            )
        }
    ],
},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store} >
    <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
