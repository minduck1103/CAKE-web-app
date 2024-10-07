import { faCartShopping, faBars, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState } from 'react';
import "../Reponsive/Reponsive.css";
import { useFormik } from 'formik';
import "../Admin/Admin.css";
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';

export default function Admin() {
    const [imagePreviews, setImagePreviews] = useState([]);
    const [order, setOrder] = useState([]);
    const id_user = sessionStorage.getItem('user_id');
    const [type, setType] = useState([]);
    const [currentCake, setCurrentCake] = useState(null);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const navigate = useNavigate();
    const [cartCakeIds, setCartCakeIds] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [name, setName] = useState('');
    const [typeIdCake, setTypeIdCake] = useState('');
    const [cake, setCake] = useState([]);


    // Fetch cake types when the component mounts


    async function getType() {
        try {
            const rep = await axios.get('http://localhost:8080/api/cake/typeCake');
            setType(rep.data)
            const cartItems = rep.data;
            const uniqueItemsCount = cartItems.length;
            setTotalQuantity(uniqueItemsCount);
            setCartCakeIds(cartItems.map(item => item.id_cake));
        } catch (error) {
            console.error('Error fetching cake types:', error);
        }
    }
    useEffect(() => {
        getType();
    }, []);


    useEffect(() => {
        async function fetchCakes() {
            try {
                const response = await axios.get('http://localhost:8080/api/cake');
                setOrder(response.data);

            } catch (error) {
                console.error('Error fetching cake data:', error);
            }
        }
        fetchCakes();
    }, []);


    const formAdd = useFormik({
        initialValues: {
            code: "",
            name: "",
            description: '',
            price: "",
            quantity: "",
            iduser: id_user,
            typeOfCake: ''
        },
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("code", values.code);
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("price", values.price);
            formData.append("quantity", values.quantity);
            formData.append("id_user", values.iduser);
            formData.append("typeOfCake", values.typeOfCake);

            for (let i = 0; i < imagePreviews.length; i++) {
                formData.append("image", imagePreviews[i]);
            }

            await axios.post("http://localhost:8080/api/cake", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            window.location.href = '/admin';

        }
    });

    const formUpdate = useFormik({
        initialValues: {
            id: '',
            code: "",
            name: "",
            description: '',
            price: "",
            quantity: "",
            iduser: id_user,
            typeOfCake: ''
        },
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("id", values.id);
            formData.append("code", values.code);
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("price", values.price);
            formData.append("quantity", values.quantity);
            formData.append("id_user", values.iduser);
            formData.append("typeOfCake", values.typeOfCake);

            for (let i = 0; i < imagePreviews.length; i++) {
                formData.append("image", imagePreviews[i]);
            }

            await axios.put(`http://localhost:8080/api/cake/${values.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            window.location.href = '/admin';

        }
    });

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

    const handleEditClick = (cake) => {
        setCurrentCake(cake);
        formUpdate.setValues({
            id: cake.id,
            code: cake.code,
            name: cake.name,
            description: cake.description,
            price: cake.price,
            quantity: cake.quantity,
            iduser: id_user,
            typeOfCake: cake.typeOfCake?.id || '',
        });
        setImagePreviews([]); // Reset image previews when editing a new cake
    };



    const handleImageChanges = (event) => {
        const files = Array.from(event.target.files);
        setImagePreviews([...imagePreviews, ...files]);
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...imagePreviews];
        updatedImages.splice(index, 1);
        setImagePreviews(updatedImages);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };


    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 6;

    // Calculate total pages
    const totalPages = Math.ceil(order.length / recordsPerPage);

    // Determine the records to display on the current page
    const currentRecords = order.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
            <div className="admin_sidebar">
                <div>
                    <h2> Danh sách Bánh </h2>
                </div>
            </div>
            <div className="admin_all">
                <div className="admin_left"></div>
                <div className="admin_center">
                    <div>
                        <form onSubmit={formAdd.handleSubmit}>
                            <button type="button" className="admin_btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Thêm bánh
                            </button>
                            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Thêm sản phẩm</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className='admin_add'>
                                                <div className='add_name'>
                                                    <label htmlFor="inputName" className="form-label">Tên bánh:</label>
                                                    <input type="text" className="form-control" name="name" id="name" onChange={formAdd.handleChange} />
                                                </div>
                                                <div className='add_code'>
                                                    <label htmlFor="inputCode" className="form-label">Mã bánh:</label>
                                                    <input type="text" className="form-control" name="code" id="code" onChange={formAdd.handleChange} />
                                                </div>
                                                <div className='add_price'>
                                                    <label htmlFor="inputPrice" className="form-label">Giá:</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" aria-label="Dollar amount (with dot and two decimal places)" name='price' onChange={formAdd.handleChange} />
                                                        <span className="input-group-text">VNĐ</span>
                                                    </div>
                                                </div>
                                                <div className='add_quantity'>
                                                    <label htmlFor="inputCode" className="form-label">Số lượng:</label>
                                                    <input type="text" className="form-control" name="quantity" id="quantity" onChange={formAdd.handleChange} />
                                                </div>
                                                <div className='add_description'>
                                                    <div className="form-floating">
                                                        <textarea className="form-control" placeholder="Leave a comment here" name="description" id="description" onChange={formAdd.handleChange} style={{ height: "150px" }}></textarea>
                                                        <label htmlFor="floatingTextarea2">Mô tả</label>
                                                    </div>
                                                </div>
                                                <div className='add_lb'>
                                                    <select
                                                        aria-label=""
                                                        id="typeOfCake"
                                                        name="typeOfCake"
                                                        className="form-control"
                                                        onChange={formAdd.handleChange}>
                                                        {type.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-4" style={{ width: "32%", marginLeft: "1%", marginTop: "3%" }}>
                                                    <div className="col-md" style={{ marginLeft: "1%" }}>
                                                        <div className="file-upload-wrapper">
                                                            <input
                                                                className="file-upload"
                                                                accept="imagePreviews/*"
                                                                name="imagePreviews"
                                                                onChange={handleImageChanges}
                                                                type="file"
                                                                id="formFileMultiple"
                                                                multiple />
                                                            <label htmlFor="file-upload">Thêm ảnh</label>
                                                        </div>
                                                    </div>
                                                    {imagePreviews.length > 0 && (
                                                        <div>
                                                            <div className="row">
                                                                {imagePreviews.map((imagePreviews, index) => (
                                                                    <div key={index} className="imagePreviews">
                                                                        <div className="position-relative">
                                                                            <img
                                                                                src={URL.createObjectURL(imagePreviews)}
                                                                                alt={`Image ${index}`}
                                                                                className="img-fluid"
                                                                            />

                                                                        </div>
                                                                        <div>
                                                                            <FontAwesomeIcon icon={faRectangleXmark}
                                                                                onClick={() => handleRemoveImage(index)}
                                                                                style={{ width: "100%" }} />

                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                            <button type="submit" className="btn btn-primary">Lưu</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Hình ảnh</th>
                                    <th scope="col">Tên bánh</th>
                                    <th scope="col">Số lượng</th>
                                    <th scope="col">Giá</th>
                                    <th scope="col">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))  // Sorting by createdAt (newest first)
                                    .map((cake, index) => (
                                        <tr key={index}>
                                            <th scope="row">{(currentPage - 1) * recordsPerPage + index + 1}</th>
                                            <td className='td_img'>
                                                <img className='admin_img' src={process.env.PUBLIC_URL + '/img/' + (cake.image[0]?.name || '')} alt={cake.name} />
                                            </td>
                                            <td>{cake.name}</td>
                                            <td>{cake.quantity}</td>
                                            <td>{formatPrice(cake.price)} VNĐ</td>
                                            <td>
                                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => handleEditClick(cake)}>
                                                    Sửa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <nav>
                            <ul className="pagination">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="staticBackdropLabel">Sửa sản phẩm</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form onSubmit={formUpdate.handleSubmit}>
                                        <div className="modal-body">
                                            <div className='admin_add'>
                                                <div className='add_name'>
                                                    <label htmlFor="inputName" className="form-label">Tên bánh:</label>
                                                    <input type="text" className="form-control" name="name" id="name" value={formUpdate.values.name} onChange={formUpdate.handleChange} />
                                                </div>
                                                <div className='add_code'>
                                                    <label htmlFor="inputCode" className="form-label">Mã bánh:</label>
                                                    <input type="text" className="form-control" name="code" id="code" value={formUpdate.values.code} onChange={formUpdate.handleChange} />
                                                </div>
                                                <div className='add_price'>
                                                    <label htmlFor="inputPrice" className="form-label">Giá:</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" aria-label="Dollar amount (with dot and two decimal places)" name='price' value={formUpdate.values.price} onChange={formUpdate.handleChange} />
                                                        <span className="input-group-text">VNĐ</span>
                                                    </div>
                                                </div>
                                                <div className='add_quantity'>
                                                    <label htmlFor="inputCode" className="form-label">Số lượng:</label>
                                                    <input type="text" className="form-control" name="quantity" id="quantity" value={formUpdate.values.quantity} onChange={formUpdate.handleChange} />
                                                </div>
                                                <div className='add_description'>
                                                    <div className="form-floating">
                                                        <textarea className="form-control" placeholder="Leave a comment here" name="description" id="description" value={formUpdate.values.description} onChange={formUpdate.handleChange} style={{ height: "150px" }}></textarea>
                                                        <label htmlFor="floatingTextarea2">Mô tả</label>
                                                    </div>
                                                </div>
                                                <div className='add_lb'>
                                                    <select
                                                        id="typeOfCake"
                                                        name="typeOfCake"
                                                        className="form-control"
                                                        value={formUpdate.values.typeOfCake}
                                                        onChange={formUpdate.handleChange}>
                                                        {type.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-4" style={{ width: "32%", marginLeft: "1%", marginTop: "3%" }}>
                                                    <div className="col-md" style={{ marginLeft: "1%" }}>
                                                        <div className="file-upload-wrapper">
                                                            <input
                                                                className="file-upload"
                                                                accept="image/*"
                                                                name="imagePreviews"
                                                                onChange={handleImageChanges}
                                                                type="file"
                                                                id="formFileMultiple"
                                                                multiple />
                                                            <label htmlFor="file-upload">Thêm ảnh</label>
                                                        </div>
                                                    </div>
                                                    {imagePreviews.length > 0 && (
                                                        <div>
                                                            <div className="row">
                                                                {imagePreviews.map((image, index) => (
                                                                    <div key={index} className="imagePreviews">
                                                                        <div className="position-relative">
                                                                            <img
                                                                                src={URL.createObjectURL(image)}
                                                                                alt={`Image ${index}`}
                                                                                className="img-fluid"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <FontAwesomeIcon icon={faRectangleXmark}
                                                                                onClick={() => handleRemoveImage(index)}
                                                                                style={{ width: "100%" }} />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                            <button type="submit" className="btn btn-primary">Lưu</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="admin_right"></div>
            </div>
            <Footer></Footer>
        </>
    );
}
