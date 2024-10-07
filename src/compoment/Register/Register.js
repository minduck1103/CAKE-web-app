import Footer from "../Footer/Footer";
import { faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Register/Register.css"
import axios from "axios";
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
export default function Register() {

    const navigate= useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const [name, setName] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const formAdd =useFormik({
        initialValues:{
            name:"",
            email:"",
            username:'',
            role:"user",
            password:''
        },
        onSubmit: async(values)=>{
            console.log(values)
            const formData=new FormData();
            formData.append("name",values.name);
            formData.append("email",values.email);
            formData.append("role",values.role);
            formData.append("username",values.username);
            formData.append("password",values.password);

            await axios.post("http://localhost:8080/api/cake/register",formData)
            const Toast = Swal.mixin({
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: "Thêm thành công"
            }).then(() => {
                navigate("/")
                // Navigate to home page after successful submission
            })
        } 
    })

    

    return (
        <>
            <div className="navbar" style={{position:"fixed"}}>
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
                        <h6 style={{ width: "20%", textAlign: 'center' }}>0</h6>
                    </div>
                    <div className="menu-icon" onClick={toggleMenu}>
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
            <div className="reginter-sidebar">
                <h2>ĐĂNG KÍ</h2>
            </div>
            <div className="reginter-all col-12">
                <div className="reginter-left col-1"></div>
                <div className="reginter-bw col-10">
                    <div className="reginter-bw1 ">
                        <p>TẠO TÀI KHOẢN</p>
                        <hr />
                    </div>
                    <div>
                        <form className="reginter-form" onSubmit={formAdd.handleSubmit}>
                            <div className="reginter-form-group1">
                                <input type="text" className="form-control" name="name" placeholder="Tên" onChange={formAdd.handleChange} />
                            </div>

                            <div className="reginter-form-group1">
                                <input type="email" className="form-control" name="email" placeholder="email" onChange={formAdd.handleChange}/>
                            </div>

                            <div className="reginter-form-group1">
                                <input type=" text" className="form-control" name="username" placeholder="Tài khoản" onChange={formAdd.handleChange}/>
                            </div>
                            <div className="reginter-form-group1">
                                <input type="password" className="form-control" name="password" placeholder="Mật khẩu"onChange={formAdd.handleChange} />
                            </div>

                            <div className="reginter-from-button">
                                <button type="submit" className="btn btn-primary">Đăng kí</button>
                            </div>
                            <div className="reginter-form_group2">
                                <a href="/">Trở về</a>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="login-right col-1"></div>
            </div>
            <div className="login-footer">
                <Footer />
            </div>

        </>
    )
}