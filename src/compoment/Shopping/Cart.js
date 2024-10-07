import "../Shopping/Cart.css"
import Footer from "../Footer/Footer";
import { faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useFormik } from 'formik';
import "../Reponsive/CartRPS.css"



export default function Cart() {
  const id_user = sessionStorage.getItem('user_id');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [cake, setCake] = useState([]);
  const [counts, setCounts] = useState({});
  const [typeIdCake, setTypeIdCake] = useState('');
  const [image, setImage] = useState([]);
  const [name, setName] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [editItemId, setEditItemId] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);
  const [order,setOrder] =useState([])
  const param = useParams();
  const [cartCakeIds, setCartCakeIds] = useState([]); // Track cake IDs in the cart

  async function getOrder(){
   const rep= await axios.post(`http://localhost:8080/api/cart/checkout/${id_user}`)
   setOrder(rep.data)
  }

  const formUpdate = useFormik({
    initialValues: {
      quantity: "",
      id_user: id_user,
      id_cake: "",
      id_cart: ""
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("quantity", values.quantity);
      formData.append("id_user", values.id_user);
      formData.append("id_cake", values.id_cake);
      formData.append("id_cart", values.id_cart);

      try {
        await axios.put(`http://localhost:8080/api/cart/${values.id_cart}`, formData);
        await getList();
      } catch (error) {
        console.error("There was an error!", error);
      }
    }
  });

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


  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  async function getDelete(id) {
    if (window.confirm("Bạn có muốn xóa bánh này không")) {
      try {
        await axios.delete(`http://localhost:8080/api/cart/${id}`);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  }

  async function getOrder() {
    const rep= await axios.post(`http://localhost:8080/api/cart/checkout/${id_user}`)
    
  }

  const [cart, setCart] = useState([]);
  async function getList() {
    try {
      const rep = await axios.get(`http://localhost:8080/api/cart/${id_user}`);
      setCart(rep.data);
      const initialCounts = rep.data.reduce((acc, item) => {
        const key = item.cake.id;
        if (!acc[key]) {
          acc[key] = item.quantity || 1;
        } else {
          acc[key] += item.quantity || 1;
        }
        return acc;
      }, {});
      setCounts(initialCounts);
      updateTotalPrice(rep.data, initialCounts);
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  }

  useEffect(() => {
    if (id_user) {
      getList();
    } else {
      console.error('User ID is missing');
    }
  }, [id_user]);

  const updateTotalPrice = (cartItems, itemCounts) => {
    const total = cartItems.reduce((acc, item) => {
      const quantity = itemCounts[item.cake.id] || 1;
      return acc + (item.cake.price * quantity);
    }, 0);
    setTotalPrice(total);
  };

  const groupedCart = cart.reduce((acc, item) => {
    const key = item.cake.id;
    if (!acc[key]) {
      acc[key] = {
        ...item,
        quantity: counts[key] || 1
      };
    }
    return acc;
  }, {});

  const groupedCartArray = Object.values(groupedCart);

  const handleUpdateQuantity = async (id, newQuantity) => {
    try {
      const formData = new FormData();
      formData.append("quantity", newQuantity);
      formData.append("id_user", id_user);
      formData.append("id_cake", id);
      const cartItem = groupedCartArray.find(item => item.cake.id === id);
      if (cartItem) {
        formData.append("id_cart", cartItem.id);
        await axios.put(`http://localhost:8080/api/cart/${cartItem.id}`, formData);

        setCounts(prevCounts => {
          const updatedCounts = { ...prevCounts, [id]: newQuantity };
          return updatedCounts;
        });
        updateTotalPrice(cart, {
          ...counts,
          [id]: newQuantity,
        });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleIncrement = (id) => {
    const newQuantity = (counts[id] || 1) + 1;
    handleUpdateQuantity(id, newQuantity);
  };

  const handleDecrement = (id) => {
    const newQuantity = (counts[id] || 1) - 1 > 0 ? (counts[id] || 1) - 1 : 1;
    handleUpdateQuantity(id, newQuantity);
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
      <div className="cart-sidebar">
        <div>
          <h2> BÁNH KEM HÀ NỘI - GIỎ HÀNG CỦA BẠN </h2>
        </div>
      </div>
      <div className="cart-all col-12">
        <div className="cart-left col-1"></div>
        <div className="cart-bw col-10">
          <div className="cart-bw-cart">
            <h3>GIỎ HÀNG</h3>
          </div>
          <hr />
          <hr />
          <form onSubmit={formUpdate.handleSubmit}>
            <table className="cart-table">
              <thead>
                <tr className="row-with-border">
                  <th className="table-none col-3"></th>
                  <th className="table-none col-3"><h4>Thông tin chi tiết</h4></th>
                  <th className="table-none col-2"><h4>Đơn giá</h4></th>
                  <th className="table-none col-2"><h4>Số lượng</h4></th>
                  <th className="table-none col-2"><h4>Tổng giá</h4></th>
                </tr>
              </thead>
              <tbody>
                {groupedCartArray.map(item => (
                  <tr key={item.cake.id} className="row-with-border">
                    <td className="table-none1">
                      <img src={process.env.PUBLIC_URL + '/img/' + (item.cake.image[0]?.name || '')} alt={item.cake.description} />
                    </td>
                    <td className="table-none">
                      <p>{item.cake.description}</p>
                      <Link className="ax" onClick={() => getDelete(item.id)}>Xóa</Link>
                    </td>
                    <td className="table-none"><p>{formatPrice(item.cake.price)} VNĐ</p></td>
                    <td className="table-none">
                      <div className="table-none-accout">
                        <div className="cart_bt" style={{ display: 'flex', alignItems: 'center' }}>
                          <button type="button" onClick={() => handleDecrement(item.cake.id)} className="cart-buttona">-</button>
                          <span className="cart_span" >{counts[item.cake.id] || 1}</span>
                          <button type="button" onClick={() => handleIncrement(item.cake.id)} className="cart-buttonb">+</button>
                          <input
                            type="hidden"
                            id="quantity"
                            name="quantity"
                            onChange={formUpdate.handleChange}
                            value={counts[item.cake.id] || 1}
                          />
                          <input
                            type="hidden"
                            id="id_user"
                            name="id_user"
                            value={id_user}
                          />
                          <input
                            type="hidden"
                            id="id_cake"
                            name="id_cake"
                            value={item.cake.id}
                          />
                          <input
                            type="hidden"
                            id="id_cart"
                            name="id_cart"
                            value={item.id}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="table-none"><p>{formatPrice((counts[item.cake.id] || 1) * item.cake.price)} VNĐ</p></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
          <div className="cart-bw-da col-12">
            <div className="cart-bw-d col-8">
              <p>Quý khách xin vui lòng nhập thông tin: Họ tên, Ngày tháng năm sinh, Địa chỉ nhận, Thời gian nhận bánh và Số điện thoại liên hệ.</p>
              <input type="text" />
            </div>
            <div className="cart-bw-a">
              <h5>Tổng tiền : {totalPrice.toLocaleString('vi-VN')} VNĐ</h5><br />
              <p style={{ width: "100%" }}>Vận chuyển</p>
              <div style={{ display: "flex", width: "100%" }}>
                <button type="button" className="cart_addcart">Cập nhật</button>
                <form onSubmit={getOrder}>
                  <button type="submit" className="cart_buycart">Thanh toán</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="cart-right col-1"></div>
      </div>
      <Footer />
    </>
  )
}