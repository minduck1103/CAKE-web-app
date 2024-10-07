import { Route, Routes } from "react-router-dom"
import Home from "./compoment/Home/Home";
import "bootstrap/dist/css/bootstrap.min.css"
import View from "./compoment/Views/View";
import Cart from "./compoment/Shopping/Cart";
import Test from "./compoment/Create/test";
import Login from "./compoment/Login/Login";
import Register from "./compoment/Register/Register";
import User from "./compoment/User/User";
import Admin from "./compoment/Admin/Admin";
import ViewCake from "./compoment/ViewCake/ViewCake";

function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<Login />}></Route>
                <Route path='/home' element={<Home />}></Route>
                <Route path='/cart' element={<Cart/>}></Route>
                <Route path='/views/:id' element={<View/>}></Route>
                <Route path='/test/:id' element={<Test/>}></Route>
                <Route path='/user' element={<User/>}></Route>i
                <Route path='/register' element={<Register/>}></Route>
                <Route path='/admin' element={<Admin/>}></Route>
                <Route path='/viewCake/:id' element={<ViewCake/>}></Route>
            </Routes>
        </>
    );
}
export default App;