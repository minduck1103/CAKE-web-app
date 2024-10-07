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
            <Footer />
        </>
    );
}
