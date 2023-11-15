const getProductData = async () => {
    const id = localStorage.getItem("id");
    const id2 = JSON.parse(id)
    // console.log(JSON.parse(id))
    const res = await fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/merchant/order/${id2}`, {
        method: "GET",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            'content-type': "application/json",
            'authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    const data = await res.json();
    return data
    // console.log(data)
}

export default getProductData;
