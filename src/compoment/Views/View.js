import Footer from "../Footer/Footer";
import { faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./View.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function View() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [cake, setCake] = useState({ image: [] });
    const params = useParams();
    const [count, setCount] = useState(0);
    const [typeIdCake, setTypeIdCake] = useState('');
    const [name, setName] = useState('');
    const [totalQuantity, setTotalQuantity] = useState(0);
    const id_user = sessionStorage.getItem('user_id');
    const [cartCakeIds, setCartCakeIds] = useState([]); // Track cake IDs in the cart

    const [visibleCount, setVisibleCount] = useState(4); 

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
    
    async function getCake() {
        const res = await axios.get(`http://localhost:8080/api/cake/${params.id}`);
        setCake(res.data);
        setTypeIdCake(res.data.typeIdCake);


    }

    useEffect(() => {
        getCake();
    }, [params.id]);

    const [itemsPage, setItemsPage] = useState(12);
    const [cakes, setCakes] = useState([]);


    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(cakes.length / itemsPage);


    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPage;
        const endIndex = startIndex + itemsPage;
        const reversedHouses = [...cakes].reverse();
        return reversedHouses.slice(startIndex, endIndex);
    };
    const currentPageData = getCurrentPageData();

    async function getList() {
        const response = await axios.get(`http://localhost:8080/api/cake?typeIdCake=${cake.typeOfCake.id}`);
        setCakes(response.data);
    }

    useEffect(() => {
        if (cake.typeOfCake && cake.typeOfCake.id) {
            getList();
        }
    }, [typeIdCake]);

    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + 8); // Increase visible count by 8
    };

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
                        <h6 style={{ width: "20%", textAlign: 'center' }}>{totalQuantity}</h6>
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
            <div className="view-sidebar">
                <h1>BÁNH NGON HÀ NỘI</h1>
            </div>
            <div className="view-all">
                <div className="view-left col-1"></div>

                <div className="view-betew col-10">
                    <div className="view-betewall col-12">
                        <div className="view-betew1 col-4">
                            <div className="view-betew123">
                                {cake.image.map((item, index) => (
                                    <div className="view-image-gallery">
                                        <img
                                            key={index}
                                            src={process.env.PUBLIC_URL + '/img/' + (item.name)}
                                            alt={`Cake image ${index + 1}`}
                                            className="cake-image"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="view-betewa">
                                {cake.image.map((item, index) => (
                                    <div className="view-image-a">
                                        <img
                                            key={index}
                                            src={process.env.PUBLIC_URL + '/img/' + (item.name)}
                                            alt={`Cake image ${index + 1}`}
                                            className="cake-image"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="betew2 col-8">
                            <div className="view-betew21">
                                <div className="view-betew211">
                                    <h4>{cake.name}</h4>
                                    <p>Mã sản phẩm: {cake.code}</p>
                                    <hr />
                                    <h5>Giá : {cake.price} VNĐ</h5>
                                </div>
                                <div className="view-betew212">
                                    <div className="view-betew2121">
                                        <h5>Số lượng : </h5>
                                        <button type="button" className="view-buttona" onClick={decrement}>
                                            -
                                        </button>
                                        <h5>{count}</h5>
                                        <button type="button" className="view-buttonb" onClick={increment}>
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="view-button">
                                    <button type="button" className="addcart">THÊM VÀO GIỎ HÀNG</button>
                                    <button type="button" className="buycart">MUA NGAY</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="betew3">
                        <button>MÔ TẢ CHUNG</button>
                        <div className="betew31">
                            <p>{cake.description}</p>
                        </div>
                    </div>

                    <div>
                        <div className="bw">
                            <h3>CÓ THỂ BẠN THÍCH</h3>
                            <h5>SẢN PHẨM CÙNG LOẠI</h5>
                        </div>
                        <div className='between2'>
                            {currentPageData.slice(0,visibleCount).map(item => (
                                <div className='a col-3' key={item.id}>
                                    <a href={`/views/${item.id}`}>
                                        <div className='image' >
                                            <img src={process.env.PUBLIC_URL + '/img/' + (item.image[0]?.name || '')} />
                                        </div>
                                    </a>
                                    <div className='nameCake'>
                                        <h3>{item.name}</h3>
                                        <h6>{item.code}</h6>
                                    </div>
                                    <div className='price'>
                                        <h6>{item.price} VNĐ</h6>
                                        <FontAwesomeIcon icon={faCartShopping} />
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
              
                <div className="right col-1"></div>
            </div>
            <div>
                    <Footer/>
                </div>
        </>
    );
}
