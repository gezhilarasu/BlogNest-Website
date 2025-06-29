import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/Login'
import OTPVerification from './pages/otp'
import Blog from './pages/mainBlog'
import Token_verify from './services/Token_verify'
import { BrowserRouter as RouterBrowser, Routes, Route } from 'react-router-dom'

function App(){
  return(
    <RouterBrowser>
      <Routes>
        <Route path='/'element={<Token_verify/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/otp' element={<OTPVerification/>}></Route>
        <Route path='/landing' element={<Landing/>}></Route>
        <Route path='/blog' element={<Blog/>}></Route>
      </Routes>
    </RouterBrowser>
  )
}
export default App
