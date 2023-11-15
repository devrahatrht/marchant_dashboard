import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import RequireAuth from './Authentication/TokenAuth/RequireAuth/RequireAuth';
import Login from './components/Login/Login';
import AddCategory from './components/pages/AddCategory/AddCategory';
import AllOrders from './components/pages/AllOrders/AllOrders';
import Home from './components/pages/Home/Home';
import OrderDetails from './components/pages/OrderDetails/OrderDetails';
import Product from './components/pages/Product/Product';
// import Profile from './components/pages/Profile/Profile';
import Shop from './components/pages/Shop/Shop';
import Sidebar from './components/pages/Sidebar/Sidebar';
import Signup from './components/Signup/Signup';
import { Toaster } from 'react-hot-toast';
import ResetPassword from './components/ResetPassword/ResetPassword';
import ResetPasswordSet from './components/ResetPasswordSet/ResetPasswordSet';




function App() {

  const queryClient = new QueryClient()

  return (
    <div className="App">

      <QueryClientProvider client={queryClient}>
        <Sidebar></Sidebar>
        <Routes>
          <Route path='/' element={
            <RequireAuth>
              <Home></Home>
            </RequireAuth>
          }></Route>
          {/* <Route path='/profile' element={
            <RequireAuth>
              <Profile></Profile>
            </RequireAuth>
          }></Route> */}
          <Route path='/shop' element={
            <RequireAuth>
              <Shop></Shop>
            </RequireAuth>
          }></Route>
          <Route path='/add-category' element={
            <RequireAuth>
              <AddCategory></AddCategory>
            </RequireAuth>
          }></Route>
          <Route path='/all_orders' element={
            <RequireAuth>
              <AllOrders></AllOrders>
            </RequireAuth>
          }></Route>
          <Route path='/order_details/:id' element={
            <RequireAuth>
              <OrderDetails></OrderDetails>
            </RequireAuth>
          }></Route>
          <Route path='/products' element={
            <RequireAuth>
              <Product></Product>
            </RequireAuth>
          }></Route>

          {/* sign un and login component route */}
          <Route path='/signup' element={<Signup></Signup>}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/reset-password' element={<ResetPassword></ResetPassword>}></Route>
          <Route path='/set-password' element={<ResetPasswordSet></ResetPasswordSet>}></Route>
        </Routes>

        <Toaster />
      </QueryClientProvider>


    </div>
  );
}

export default App;
