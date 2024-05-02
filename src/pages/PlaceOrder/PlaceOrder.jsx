import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import {useNavigate} from 'react-router-dom';

const PlaceOrder = () => {



  const {getTotalCartAmount , token , food_list , cartItem , url } = useContext(StoreContext)
  
  const [data , setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:"",
  })

  const placeOrder = async (e)=>{
    e.preventDefault();
    let orderItems = []
    food_list.map((item) => {
      if (cartItem[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItem[item._id];
        orderItems.push(itemInfo);
      }
      
    })
    // console.log(orderItems)
    
    
    
    let orderData = {
     address:data,
     items:orderItems,
     amount:getTotalCartAmount()+2,
    }
    console.log(orderData)
   
   
    let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}})
    console.log(`response : ${response.data.success}`)
    if(response.data.success){
      const {session_url} = response.data;
      window.location.replace(session_url);
      console.log("inside response")
    }
    else{
      alert("Error");
    }

  }


  

  const onChangeHandler = (e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setData(data=>({...data,[name]:value}))
  }
  const navigate = useNavigate()

  useEffect(()=>{
    if(!token){
      navigate("/cart")
    }
    else if(getTotalCartAmount()===0){
      navigate("/cart")
    }

  },[token])
  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>
          Delivery information
        </p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
          <input  name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" required placeholder='Last name' />
        </div>
        <input name='email' onChange={onChangeHandler} value={data.email}  type="email" required placeholder='Email address' />
        <input name='street' onChange={onChangeHandler} value={data.street}  type="text" required placeholder='Street' />
        <div className="multi-fields">
          <input name='city' onChange={onChangeHandler} value={data.city} type="text" required placeholder='City' />
          <input name='state' onChange={onChangeHandler} value={data.state} type="text" required placeholder='State' />
        </div>
        <div className="multi-fields">
          <input name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" required placeholder='Zip Code' />
          <input name='country' onChange={onChangeHandler} value={data.country} type="text" required placeholder='Country' />
        </div>
        <input name='phone' onChange={onChangeHandler} value={data.phone} type="text" required placeholder='Phone' />
      </div>

      <div className="place-order-right">
      <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
          <div className="cart-total-detail">
            <p>Sub Total</p>
            <p> ${getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-detail">
            <p>Delivery Fee</p>
            <p>${getTotalCartAmount()===0?0:2}</p>
          </div>
          <hr />
          <div className="cart-total-detail">
            <b>Total</b>
            <b>${getTotalCartAmount()===0?0:getTotalCartAmount()+ 2}</b>
          </div>
          
          </div>
          <button type='submit' >PROCEED TO PAYMENT</button>
        </div>
      </div>

    </form>
  )
}

export default PlaceOrder