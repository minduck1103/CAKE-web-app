import React, { useEffect, useState } from "react";
import axios from "axios";
import "../User/User.css";
import Footer from "../Footer/Footer";
import { faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default function User() {
  const id_user = sessionStorage.getItem("user_id");

  const [cake, setCake] = useState([]);
  const [counts, setCounts] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [cart, setCart] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  useEffect(() => {
    if (id_user) {
      getList();
    } else {
      console.error("User ID is missing");
    }
  }, [id_user]);

  async function getList() {
    try {
      const rep = await axios.get(`http://localhost:8080/api/order/${id_user}`);
      setCart(rep.data);
      const initialCounts = rep.data.reduce((acc, item) => {
        const key = item.cake.id;
        acc[key] = item.quantity || 1;
        return acc;
      }, {});
      setCounts(initialCounts);
      updateTotalPrice(rep.data, initialCounts);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  }

  const updateTotalPrice = (cartItems, itemCounts) => {
    const total = cartItems.reduce((acc, item) => {
      const quantity = itemCounts[item.cake.id] || 1;
      return acc + item.cake.price * quantity;
    }, 0);
    setTotalPrice(total);
  };

  const groupedCart = cart.reduce((acc, item) => {
    const key = item.cake.id;
    if (!acc[key]) {
      acc[key] = {
        ...item,
        quantity: counts[key] || 1,
      };
    }
    return acc;
  }, {});

  const groupedCartArray = Object.values(groupedCart);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = groupedCartArray.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(groupedCartArray.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
        <h2>LỊCH SỬ ĐẶT BÁNH</h2>
      </div>
      <table className="user-table">
        <thead>
          <tr className="user-row-with-border">
            <th className="table-none col-3"></th>
            <th className="table-none col-3">
              <h4>Thông tin chi tiết</h4>
            </th>
            <th className="table-none col-2">
              <h4>Đơn giá</h4>
            </th>
            <th className="table-none col-2">
              <h4>Số lượng</h4>
            </th>
            <th className="table-none col-2">
              <h4>Tổng giá</h4>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.cake.id} className="user-row-with-border">
              <td className="-user-table-none1">
                <img
                  src={process.env.PUBLIC_URL + "/img/" + (item.cake.image[0]?.name || "")}
                  alt={item.cake.description}
                />
              </td>
              <td className="user-table-none">
                <p>{item.cake.description}</p>
              </td>
              <td className="user-table-none">
                <p>{formatPrice(item.cake.price)} VNĐ</p>
              </td>
              <td className="user-table-none">
                <div className="user-table-none-accout">
                  <span className="user_span">{counts[item.cake.id] || 1}</span>
                </div>
              </td>
              <td className="user-table-none">
                <p>{formatPrice((counts[item.cake.id] || 1) * item.cake.price)} VNĐ</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={currentPage === pageNumber ? "active-page" : ""}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <Footer />
    </>
  );
}

// Utility function for price formatting
function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
