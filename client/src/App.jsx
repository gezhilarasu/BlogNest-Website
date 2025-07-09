import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/Login'
import OTPVerification from './pages/otp'
import Blog from './pages/mainBlog'
import Mail from './pages/mail';
import ResetPassword from './pages/newpassword';
import CreatePost from './pages/post';
import Token_verify from './services/Token_verify';
import MyPosts from './pages/mypost'
import PostDetails from './pages/postdetail';
import Favorite from './pages/favorite';
import { BrowserRouter as RouterBrowser, Routes, Route } from 'react-router-dom';

function App(){
  return(
    <RouterBrowser>
      <Routes>
        <Route path='/'element={<Token_verify/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/otp' element={<OTPVerification/>}></Route>
        <Route path='/landing' element={<Landing/>}></Route>
        <Route path='/mainBlog' element={<Blog/>}></Route>
        <Route path='/mail' element={<Mail/>}></Route>
        <Route path='/newpassword' element={<ResetPassword/>}></Route>
        <Route path='/createpost' element={<CreatePost/>}></Route>
        <Route path='/myposts' element={<MyPosts/>}></Route>
        <Route path='/postDetails' element={<PostDetails/>}></Route>
        <Route path='/favorite' element={<Favorite/>}></Route>
      </Routes>
    </RouterBrowser>
  )
}
export default App
