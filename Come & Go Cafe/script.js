    const addButtons = document.querySelectorAll('.add-button');
    const orderList = document.getElementById('order-list');

    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.getAttribute('data-item');
            const sizeName = `size${itemName.slice(-1)}`; // get size input name
            const sizeInputs = document.querySelectorAll(`input[name="${sizeName}"]`);
            let selectedSize = 'Small'; // default
            sizeInputs.forEach(input => {
                if (input.checked) selectedSize = input.value;
            });
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `<span>${itemName} (${selectedSize})</span>`;
            orderList.appendChild(orderItem);
        });
    });

    document.getElementById('placeOrder').addEventListener('click', () => {
        alert('Order placed! Total items: ' + document.querySelectorAll('.order-item').length);
    });