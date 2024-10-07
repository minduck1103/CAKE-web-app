import { faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "../Home/Home.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "../Reponsive/Reponsive.css";
import { useFormik } from 'formik';
import Footer from '../Footer/Footer';
import "../Reponsive/HomeReponsive.css";

export default function Home() {
    const username = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');
    const id_user = sessionStorage.getItem('user_id');
    const [menuOpen, setMenuOpen] = useState(false);
    const [cake, setCake] = useState([]);
    const [itemsPage, setItemsPage] = useState(8);
    const [image, setImage] = useState([]);
    const [selectedCakeId, setSelectedCakeId] = useState('');
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [visibleCount, setVisibleCount] = useState(8);


    const navigate = useNavigate();
    const [cartCakeIds, setCartCakeIds] = useState([]); // Track cake IDs in the cart




    const [name, setName] = useState('');
    const [typeIdCake, setTypeIdCake] = useState('');



    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(cake.length / itemsPage);


    async function getList() {
        const response =
            await axios.get(`http://localhost:8080/api/cake?name=${name}&typeIdCake=${typeIdCake}`);
        setCake(response.data);


    }

    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    useEffect(() => {
        getList()
    }, [name, typeIdCake]);



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
                    navigate("/home");
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


    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const groupedCakes = cake.reduce((groups, item) => {
        if (!groups[item.typeOfCake.name]) {
            groups[item.typeOfCake.name] = {
                cakes: [],
                typeId: item.typeOfCake.id // Lưu trữ ID loại bánh
            };
        }
        groups[item.typeOfCake.name].cakes.push(item);
        return groups;
    }, {});


    const cakeTypeIds = {
        'Bánh sinh nhật': '1', // Replace '1' with the actual ID for 'Bánh sinh nhật'
        'Bánh Gâteaux kem tươi': '2', // Replace '2' with the actual ID for 'Bánh Gâteaux kem tươi'
        'Bánh Mousse': '3', // Replace '3' with the actual ID for 'Bánh Mousse'
    };

    const handleDropdownSelect = (cakeTypeName) => {
        const id = cakeTypeIds[cakeTypeName]; // Get the corresponding idtypecake
        setTypeIdCake(id); // Set the typeIdCake state with the idtypecake
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
                                    <li><a href="#" onClick={() => handleDropdownSelect('Bánh sinh nhật')}>Bánh sinh nhật</a></li>
                                    <li><a href="#" onClick={() => handleDropdownSelect('Bánh Gâteaux kem tươi')}>BÁNH GATEAUX KEM TƯƠI</a></li>
                                    <li><a href="#" onClick={() => handleDropdownSelect('Bánh Mousse')}>BÁNH MOUSSE</a></li>
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

            <div className='sidebar'>
                <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img src="https://theme.hstatic.net/1000313040/1000406925/14/ms_banner_img1.jpg?v=2127" class="d-block w-100" alt="..." />
                        </div>
                        <div class="carousel-item">
                            <img src="https://theme.hstatic.net/1000313040/1000406925/14/ms_banner_img1.jpg?v=2115" class="d-block w-100" alt="..." />
                        </div>
                        <div class="carousel-item">
                            <img src="https://theme.hstatic.net/1000313040/1000406925/14/ms_banner_img2.jpg?v=2107" class="d-block w-100" alt="..." />
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
            <div className='all col-12' style={{ display: "flex" }} >
                <div className='left col-2'></div>
                <div className='between col-8'>
                    {Object.keys(groupedCakes).map(typeOfCake => (
                        <div key={typeOfCake}>
                            <div className='between1'>
                                <h3 className="birthdayCake-title">{typeOfCake} </h3>
                                <img src='https://theme.hstatic.net/1000313040/1000406925/14/home_line_collection1.png?v=2115' />
                            </div>
                            <div className='between2'>
                            {groupedCakes[typeOfCake].cakes.slice(0, visibleCount).map(item => (
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
                                            <div className='price1'>
                                                <p>{formatPrice(item.price)}  VNĐ</p>
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
                            <button className='showAll_cakeid'>
                                <a href={`/viewCake/${groupedCakes[typeOfCake].typeId}`}>Xem thêm</a>
                            </button>
                        </div>
                    ))}
                </div>

                <div className='right col-2'></div>
            </div>
            <div className='cah'>

            </div>
            <div className='home-oder'>
            </div>
            <div className='home-oder'>
                <div className='home-oder-all'>
                    <div className='home-name'>
                        <h3><b>ĐẶT ONLINE NGAY</b></h3>
                        <h4>KHÔNG CÒN PHẢI ĐỢI CHỜ GÌ NỮA</h4>
                    </div>
                    <div className="home-order-input">
                        <label for="name">Họ tên của bạn</label>
                        <input type="text" id="name" />

                        <label for="email">Địa chỉ email của bạn</label>
                        <input type="email" id="email" />

                        <label for="phone">Số điện thoại của bạn</label>
                        <input type="tel" id="phone" />

                        <label for="message">Nội dung</label>
                        <input type="text" id="message" placeholder="Nội dung" />
                    </div>
                </div>
            </div>
            <div className='cah1'>
            </div>
            <div className='news-oder'>
                <div className='news1'>
                    <div className='news11'>
                        <h1 style={{ color: "#c0c906", fontWeight: "bold", fontFamily: "Arial, sans-serif" }}>VỀ CHÚNG TÔI</h1>
                        <h5 style={{ color: "#3d1a1a", fontWeight: "bold", fontFamily: "Arial, sans-serif" }}>CHÀO MỪNG BẠN ĐẾN VỚI CỬA HÀNG BÁNH ANH HOA</h5>

                    </div>
                    <div className='new12-oder'>
                        <div className='new121-oder'>
                            <img src='https://theme.hstatic.net/1000313040/1000406925/14/intro.png?v=2133' />
                        </div>
                        <div className='new122-oder'>
                            <p>
                                Anh Hòa Bakery là thương hiệu bánh ngọt Pháp của công ty cổ phần bánh ngọt Anh Hòa.
                                Được thành lập từ năm 2004 tại con phố Ngõ Trạm, quận Hoàn Kiếm, Hà Nội.
                                Trải qua hơn 15 năm phát triển, đến nay Anh Hòa Bakery đã có 13 cơ sở kinh doanh
                                đặt trên những tuyến phố đông dân cư ở Hà Nội. Các sản phẩm Anh Hòa Bakery được làm
                                từ các nguyên liệu nhập khẩu của các nước có truyền thống làm bánh như: Newzeland, Mỹ,
                                Pháp, Bỉ. Với hương vị thơm ngon đặc trưng của các loại kem, bơ, sữa, phô mai, hạt hạnh
                                nhân, chocolate... dưới bàn tay khéo léo của những người thợ làm bánh giàu kinh nghiệm.
                                Quy mô xưởng sản xuất rộng hơn 2000m2 với các thiết bị tiên tiến hiện đại theo tiêu chuẩn ISO 2018,
                                toàn bộ nhà máy được sơn phủ bởi sơn EPOXY đặc biệt. Anh Hòa Bakery luôn mang đến cho khách hàng những
                                sản phẩm chất lượng nhất, đảm bảo tuyệt đối về an toàn vệ sinh thực phẩm.
                            </p>
                            <button className='showAll_cakeid' >
                                <a href='#'>Đọc thêm</a>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <div className='cah1'>
            </div>


            <Footer />

            <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
            <script src="https://maxcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
        </>
    );
}
