import Footer from "../Footer/Footer";
import { faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Login/Login.css"
import "../Reponsive/LoginRPS.css"

import axios from "axios";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const id_user = sessionStorage.getItem('user_id');
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [cartCakeIds, setCartCakeIds] = useState([]); // Track cake IDs in the cart


    const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('username'));
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchCart() {
            try {
                const response = await axios.get(`http://localhost:8080/api/cart/${id_user}`);
                const cartItems = response.data;
                const uniqueItemsCount = cartItems.length; // Count the number of unique cake items
                setTotalQuantity(uniqueItemsCount);
                setCartCakeIds(cartItems.map(item => item.id_cake)); // Store the cake IDs in the cart
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        }

        if (id_user) {
            fetchCart();
        }
    }, [id_user]);

    async function login(e) {
        e.preventDefault();
        try {
            const rep = await axios.post("http://localhost:8080/api/cake/login", {
                username: username,
                password: password
            });
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('password', password);
            sessionStorage.setItem('user_id', rep.data.id);
            sessionStorage.setItem('role', rep.data.role);
            setIsLoggedIn(true);
            if (rep.data.role === 'user') {
                navigate('/home');
            } else {
                navigate('/admin');
            }
        } catch (error) {
            console.error('Login failed', error);
            // Handle login error (e.g., display an error message)
        }
    }

    function logout() {
        sessionStorage.clear();
        setIsLoggedIn(false);
        setTotalQuantity(0);  // Reset cart quantity to zero
        navigate('/');
    }


    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const [name, setName] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className="navbar" style={{ position: "fixed" }}>
                <div className="menu1 col-12" style={{ display: "flex" }}>
                    <div className="logo col-2">
                        <img src="https://theme.hstatic.net/1000313040/1000406925/14/logo.png?v=2115" />
                    </div>
                    <div className="search col-2">
                        <input type="search" placeholder="Tìm kiếm" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="phone col-2" style={{ display: 'flex' }}>
                        <a href='/test'>
                            <img src='https://png.pngtree.com/png-vector/20230213/ourlarge/pngtree-circle-phone-call-icon-in-black-color-png-image_6596895.png'
                                style={{ width: "100%", borderRadius: "50%" }} />
                        </a>
                        <h6 style={{ width: "50%", textAlign: 'center' }}> 0848123085</h6>
                    </div>
                    <div className="branch col-2" style={{ display: 'flex' }}>
                        <a href='/test' >
                            <img src='https://png.pngtree.com/png-vector/20190215/ourlarge/pngtree-vector-building-icon-png-image_516326.jpg'
                                style={{ width: "100%", borderRadius: "50%" }} />
                        </a>
                        <h6 style={{ width: "50%", textAlign: 'center' }}> Chi nhánh</h6>
                    </div>
                    <div className="user col-2" style={{ display: 'flex' }}>
                        <a href='/' >
                            <img src='https://static.vecteezy.com/system/resources/thumbnails/007/033/146/small_2x/profile-icon-login-head-icon-vector.jpg'
                                style={{ width: "100%", borderRadius: "50%" }} />
                        </a>
                        <h6 style={{ width: "50%", textAlign: 'center' }}> Tài khoản</h6>
                    </div>
                    <div className="cart col-2" style={{ display: 'flex' }}>
                        <a href='/cart'>
                            <img src='https://media.istockphoto.com/id/639201388/vector/shopping-cart-icon.jpg?s=612x612&w=is&k=20&c=OABCYZ7OniUdLrgJZuSgq2zuTNClyGGJPM_o5u9ZJnA='
                                style={{ width: "100%", borderRadius: "50%" }} />
                        </a>
                        <h6 style={{ width: "20%", textAlign: 'center' }}>{totalQuantity}</h6>
                    </div>
                    <div className="menu-icon" >
                        <FontAwesomeIcon icon={faBars} />
                    </div>
                </div>
                <div className={`menu  ${menuOpen ? 'open' : ''}`} style={{ width: "100%" }}>
                    <ul style={{ display: "flex", width: "100%" }}>
                        <li className='' style={{ width: "13%" }}></li>
                        <li className='home '>
                            <a href='/home'> TRANG CHỦ</a>
                        </li>
                        <li className='Banhsn '>
                            <a href="#" onClick={toggleDropdown}>
                                BÁNH SINH NHẬT
                            </a>
                            {isOpen && (
                                <ul className="dropdown-menu">
                                    <li><a href="#">Bánh sinh nhật</a></li>
                                    <li><a href="#">BÁNH GATEAUX KEM TƯƠI</a></li>
                                    <li><a href="#">BÁNH MOUSSE</a></li>

                                </ul>
                            )}
                        </li>
                        <li className="cakecook">
                            <a href="#" onClick={toggleDropdown}>
                                COOKIES & MINICAKE
                            </a>
                            {isOpen && (
                                <ul className="dropdown-menu">
                                    <li><a href="#">Link 1</a></li>
                                    <li><a href="#">Link 2</a></li>
                                    <li><a href="#">Link 3</a></li>
                                </ul>
                            )}
                        </li>
                        <li className='cakemi ' ><a href='#'>BÁNH MÌ & BÁNH MẶN</a></li>
                        <li className='news ' ><a href='#'>TIN TỨC</a></li>
                        <li className='promotion '><a href='#'>KHUYẾN MẠI</a></li>
                    </ul>
                </div>
            </div>
            <div className="login-sidebar">
                <h2>TÀI KHOẢN</h2>
            </div>
            <div className="login-all col-12">
                <div className="login-left col-1"></div>
                <div className="login-bw col-10">
                    <div className="login-bw1 ">
                        <p>ĐĂNG NHẬP</p>
                        <hr />
                    </div>
                    <div>
                        {isLoggedIn ? (
                            <div className="account-info">
                                <p>Xin chào, {sessionStorage.getItem('username')}</p>
                                <button className="loguot_btn btn-primary" onClick={logout}>Đăng xuất</button><br /><br />
                                <a href="/user">Lịch sử đặt bánh</a><br/> <br/>
                                {sessionStorage.getItem('role') === 'admin' && (
                                    <a href="/admin">Danh sách sản phẩm</a>
                                )}
                            </div>
                        ) : (
                            <form className="login-form" onSubmit={login}>
                                <div className="form-group">
                                    <input type="text" className="form-control1" placeholder="Tài khoản" onChange={(e) => setUsername(e.target.value)} />
                                </div>
                                <div className="form-group1">
                                    <input type="password" className="form-control" placeholder="Mật khẩu" onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="from-button">
                                    <button type="submit" className="loh_btn btn-primary">Đăng nhập</button>
                                </div>
                                <div className="form_group2">
                                    <a href="/home">Trở về</a><br /><br />
                                    <a href="/register">Đăng kí</a><br /><br />
                                    <a href="/home">Quên mật khẩu?</a>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
                <div className="login-right col-1"></div>
            </div>
            <div className="login-footer">
                <Footer />
            </div>
        </>
    );
}
