import React, { useEffect, useState } from "react";
import { faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import "../User/User.css";
import { useParams } from "react-router-dom"; // Import useParams để lấy typeIdCake từ URL
import Footer from "../Footer/Footer";
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';

export default function ViewCake() {

    const { typeIdCake } = useParams(); // Lấy typeIdCake từ URL
    const id_user = sessionStorage.getItem('user_id');
    const [cake, setCake] = useState([]);
    const params = useParams();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [count, setCount] = useState(0);
    const [typeIdCakes, setTypeIdCake] = useState('');
    const [name, setName] = useState('');
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [selectedCakeId, setSelectedCakeId] = useState('');
    const [cartCakeIds, setCartCakeIds] = useState([]); //



    async function getList() {
        try {
            const response = await axios.get(`http://localhost:8080/api/cake?typeIdCake=${params.id}`);
            setCake(response.data);
        } catch (error) {
            console.error('Error fetching cake data:', error);
            // Có thể hiển thị thông báo lỗi cho người dùng nếu cần
        }
    }

    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    useEffect(() => {
        getList();
    }, [typeIdCake]); // Mỗi khi typeIdCake thay đổi, gọi lại getList()

    const groupedCakes = cake.reduce((groups, item) => {
        const group = groups[item.typeOfCake.name] || [];
        group.push(item);
        groups[item.typeOfCake.name] = group;
        return groups;
    }, {});


    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
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


    const formAdd = useFormik({
        initialValues: {
            quantity: "",
            id_user: "",
            id_cake: ""
        },
        onSubmit: async () => {
            const formData = new FormData();
            formData.append("quantity", 1);
            formData.append("id_user", id_user);
            formData.append("id_cake", selectedCakeId);
    
            await axios.post("http://localhost:8080/api/cart", formData)
                .then(() => {
                    if (!cartCakeIds.includes(selectedCakeId)) {
                        setTotalQuantity(prevQuantity => prevQuantity + 1);
                        setCartCakeIds([...cartCakeIds, selectedCakeId]); // Add the new cake ID to the cart
                    }
                    // Remove the navigate call to stay on the same page
                })
                .catch(error => {
                    console.error("There was an error!", error);
                });
        }
    });
    
    const handleSubmit = (event, id) => {
        event.preventDefault();
        setSelectedCakeId(id);
        formAdd.setFieldValue("id_cake", id);
        formAdd.handleSubmit(event);
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

            <div className='all col-12' style={{ display: "flex" }}>
                <div className='left col-2'></div>
                <div className='between col-8'>
                    {Object.keys(groupedCakes).map(typeOfCake => (
                        <div key={typeOfCake}>
                            <div className='between1'>
                                <h3 className="birthdayCake-title">{typeOfCake} </h3>
                                <img src='https://theme.hstatic.net/1000313040/1000406925/14/home_line_collection1.png?v=2115' alt="Line" />
                            </div>
                            <div className='between2'>
                                {groupedCakes[typeOfCake].slice(0).map(item => (
                                    <div className='a col-3' key={item.id}>
                                        <a href={`/views/${item.id}`}>
                                            <div className='image'>
                                                <img src={process.env.PUBLIC_URL + '/img/' + (item.image[0]?.name || '')} alt={item.name} />
                                            </div>
                                        </a>
                                        <div className='nameCake'>
                                            <h3>{item.name}</h3>
                                            <h6>{item.code}</h6>
                                        </div>
                                        <div className='price'>
                                            <div className='price1'>
                                                <p>{formatPrice(item.price)} VNĐ</p>
                                            </div>
                                            <div className='price2'>
                                                <form onSubmit={(event) => handleSubmit(event, item.id)}>
                                                    <input type='hidden' name='id_cake' value={item.id} onChange={formAdd.handleChange} />
                                                    <button type='submit' className='btas'>
                                                        <FontAwesomeIcon className="small-icon" icon={faCartShopping} />
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className='right col-2'></div>
            </div>
            <div className='cah1'>
            </div>
            <Footer />
        </>
    );
}
