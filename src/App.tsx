import './App.css'
import Account from './components/pages/Account/Account'
import AllImages from './components/pages/AllImages/AllImages'
import Home from './components/pages/Home/Home'
import ImageDetail from './components/pages/ImageDetail/ImageDetail'
import Likes from './components/pages/Likes/Likes'
import ListImages from './components/pages/ListImages/ListImages'
import Lists from './components/pages/Lists/Lists'
import Login from './components/pages/Login/Login'
import Register from './components/pages/Register/Register'
import LanguageSettings from './components/pages/Settings/LanguageSettings/LanguageSettings'
import Settings from './components/pages/Settings/Settings'
import ThemeSettings from './components/pages/Settings/ThemeSettings/ThemeSettings'
import Menu from './components/UI/Menu/Menu'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <div className='App'>
      <BrowserRouter basename={import.meta.env.DEV ? '/' : '/fantqtravel/'}>
        <Menu/>
        <Routes>
          <Route index element={<Home/>}></Route>
          <Route path='/all' element={<AllImages/>}></Route>
          <Route path='/image' element={<ImageDetail/>}></Route>
          <Route path='/lists' element={<Lists/>}></Route>
          <Route path='/list/:id' element={<ListImages/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/likes' element={<Likes/>}></Route>
          <Route path='/account' element={<Account/>}></Route>
          <Route path='/settings' element={<Settings/>}></Route>
          <Route path='/settings/language' element={<LanguageSettings/>}></Route>
          <Route path='/settings/theme' element={<ThemeSettings/>}></Route>
          <Route path='/*' element={<div><h1>404</h1><h3>Не знайдено</h3></div>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
