const table = document.querySelector("table");
const tbody = table.querySelector("tbody");
const add_product_form = document.querySelector(".add_product_form");

//inputs to post a product
const product_name = add_product_form.querySelector("#product_name");
const price = add_product_form.querySelector("#price");
const quantity = add_product_form.querySelector("#quantity");


//excel form data
const csv_form = document.querySelector("#upload_csv");
const file = document.querySelector("#csvFile");

add_product_form.addEventListener("submit", postElement);

fetch("./controller/product.controller.php")
.then(res => res.json())
.then((res) => {
       res.reverse().map((element) =>{
            tbody.innerHTML += `
                <tr class='class-${element.id}'> 
                    <td class='class-product-name'>${element.product_name}</td>
                    <td class='class-product-quantity'>${element.quantity}</td>
                    <td class='class-product-price-per-item'>$${element.price_per_item}</td>
                    <td>${element.time_submited}</td>
                    <td class="class-totalValue">$${element.total_value}</td>
                    <td onClick="deleteElement('${element.id}')"><img style='cursor:pointer;' src='https://img.icons8.com/material-outlined/24/trash--v1.png' alt="Trash Icon"> </td>
                    <td class='class-edit'>
                        <img onClick="editable('${element.id}')" style='cursor:pointer;width:25px;' src='https://img.icons8.com/fluency-systems-filled/50/edit.png' alt='Edit icon'>
                    </td>
                </tr>
            `
        })
})

csv_form.addEventListener("submit",(e) => {
    e.preventDefault();
    const formData = new FormData();
    
    if(file.files.length > 0){
        formData.append("csvFile",file.files[0]);

        fetch("./controller/update.controller.php", {
            "method": "POST",
            "body": formData
        })
        .then(res => res.json())
        .then((res) => {
            for(let i = 1; i < res.length;i++){
                fetch("./controller/product.controller.php",{
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify({
                        "product_name": res[i].A,
                        "price":Number(res[i].B),
                        "quantity": Number(res[i].C)
                    })
                });
            }
        })
        .then(location.reload());
    }else{
        alert("Choose a file !");
    }

})


function deleteElement(product_id){
    fetch(`./controller/product.controller.php?product_id=${product_id}`, {
        method: "DELETE"
    }).then(location.reload());
}

function postElement(e){
    e.preventDefault();

    fetch("./controller/product.controller.php",{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
            "product_name": product_name.value,
            "price": price.value,
            "quantity":quantity.value
        })
    }).then(location.reload());
}
function saveEdit(id,product_name, product_quantity, product_price){
    const convertedPrice = String(product_price).replace("$","");

    fetch(`./controller/product.controller.php`,{
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "product_id": id,
            "new_product_name": product_name,
            "price_per_item": convertedPrice,
            "quantity":product_quantity
        })
    }) 
    const tr = tbody.querySelector(`.class-${id}`);
    const name = tr.querySelector(`.class-product-name`);
    const quantity = tr.querySelector(`.class-product-quantity`);
    const price = tr.querySelector(`.class-product-price-per-item`);
    const totalValue = tr.querySelector(".class-totalValue");
    const edit = tr.querySelector(".class-edit");

    name.innerHTML = product_name;
    quantity.innerHTML = product_quantity;
    price.innerHTML = product_price;
    totalValue.innerHTML = `$${Number(product_quantity) * Number(convertedPrice)}`;
    edit.innerHTML = `<img onClick="editable('${id}')" style='cursor:pointer;width:25px;' src='https://img.icons8.com/fluency-systems-filled/50/edit.png' alt='Edit icon'>`
}

function editable(id) {
    const tr = tbody.querySelector(`.class-${id}`);

    const edit = tr.querySelector(".class-edit");
    const name = tr.querySelector(`.class-product-name`);
    const quantity = tr.querySelector(`.class-product-quantity`);
    const price = tr.querySelector(`.class-product-price-per-item`);

    name.innerHTML = `
        <input class='class-name_input' value='${name.textContent}'>
    `;
    quantity.innerHTML = `
        <input class='class-quantity_input' value='${quantity.textContent}'>
    `;
    price.innerHTML = `
        <input class='class-price_input' value='${price.textContent}'>
    `;

    const nameInput = tr.querySelector('.class-name_input');
    const quantityInput = tr.querySelector('.class-quantity_input');
    const priceInput = tr.querySelector('.class-price_input');

    edit.innerHTML = `<img class="class-save" style='cursor:pointer;width:25px;' src="https://img.icons8.com/external-basicons-solid-edtgraphics/50/external-Edited-files-basicons-solid-edtgraphics.png">`;

    const saveBtn = tr.querySelector(".class-save");
    saveBtn.addEventListener("click", () => {
        saveEdit(id, nameInput.value, quantityInput.value, priceInput.value);
    });
}

async function downloadSheet() {
    const response = await fetch("./controller/product.controller.php");
    const jsonResponse = await response.json();

    const downloadResponse = await fetch("./controller/download.controller.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonResponse)
    });

    const blob = await downloadResponse.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'products.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}