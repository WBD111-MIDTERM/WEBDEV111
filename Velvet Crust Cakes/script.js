const cakeData = [
    { name: "Chocolate Strawberry Cake", price: 45, category: "Chocolate", desc: "Deep dark chocolate with a silky ganache.", img: "https://i.pinimg.com/736x/9d/25/93/9d2593780fe22eba7acf1ea6e9e57110.jpg" },
    { name: "Dark Forest", price: 38, category: "Chocolate", desc: "Fresh strawberries whipped into light cream.", img: "https://i.pinimg.com/1200x/0a/8f/14/0a8f1458c751d7d514e760a037c02f77.jpg" },
    { name: "Easy Salted Caramel Cheesecake", price: 35, category: "Cheesecake", desc: "Local honey infused into a crunchy crust.", img: "https://i.pinimg.com/736x/40/a5/7b/40a57b1ab8adfb91c1915058c344942c.jpg" },
    { name: "Cheesecake De Dulse De LECHE", price: 40, category: "Cheesecake", desc: "Authentic Madagascan vanilla bean sponge.", img: "https://i.pinimg.com/736x/29/33/73/293373192babd1cb3960dca06cbbdba6.jpg" },
    { name: "Cookies and Cream", price: 42, category: "Oreo", desc: "Salted caramel with toasted almond bits.", img: "https://i.pinimg.com/1200x/ff/6f/8c/ff6f8c274c92b4ab65a706c96818d592.jpg" },
    { name: "Fruit Cake", price: 50, category: "Fruit", desc: "Roasted pistachios and white chocolate glaze.", img: "https://i.pinimg.com/1200x/0a/27/ac/0a27acd372042e6642ea996214fb1ed8.jpg" },
    { name: "Red Velvet Oreo Cheesecake", price: 32, category: "Cheesecake", desc: "Zesty lemon curd on a shortbread base.", img: "https://i.pinimg.com/736x/82/56/eb/8256eb6e8870e822c6bd6be8ce6f63eb.jpg" },
    { name: "Chocolate Overload", price: 48, category: "Chocolate", desc: "NY style cheesecake with forest berries.", img: "https://i.pinimg.com/736x/76/75/cc/7675cc8482ff65e862296f0b775ad871.jpg" },
    { name: "Love Chocolate Cake", price: 46, category: "Chocolate", desc: "Cherries and chocolate with whipped kirsch.", img: "https://i.pinimg.com/1200x/f5/1e/ad/f51ead7b040a5e362c5070c5b64b7a07.jpg" },
    { name: "Espresso Cream", price: 44, category: "Specialty", desc: "Rich coffee layers for the caffeine lovers.", img: "https://i.pinimg.com/736x/60/df/69/60df690d3659b70c52d46a8b470da2f7.jpg" }
];

const banners = [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200",
    "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=1200",
    "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=1200"
];

const CART_KEY = "velvetCart";

let cart = [];
let bannerIdx = 0;
let pendingItem = null;

// Initialization
window.onload = () => {
    cart = loadCartFromStorage();
    updateCartCountDisplay();

    renderCakes();
    
    // Setup Search Event
    const searchBar = document.querySelector('.search-bar');
    if(searchBar) {
        searchBar.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            renderCakes(term);
        });
    }

    setInterval(rotateBanner, 4000);

    // If we're on the summary page, render existing cart data.
    updateCart();
};

// Unified Render Function with Filter
function renderCakes(filter = "") {
    const fullGrid = document.getElementById('full-grid');
    const trendGrid = document.getElementById('trending-grid');
    
    if(fullGrid) fullGrid.innerHTML = '';
    if(trendGrid) trendGrid.innerHTML = '';

    cakeData.forEach((cake, idx) => {
        if(cake.name.toLowerCase().includes(filter) || cake.category.toLowerCase().includes(filter)) {
            const html = `
                <div class="cake-card">
                    <span class="category-tag">${cake.category}</span>
                    <img src="${cake.img}" style="width:100%; height:180px; object-fit:cover; border-radius:15px;">
                    <h3>${cake.name}</h3>
                    <p style="font-size:0.8rem; opacity:0.8;">${cake.desc}</p>
                    <p><strong>$${cake.price}</strong></p>
                    <button class="btn-cream" onclick="askConfirm('${cake.name}', ${cake.price})">Add to Cart</button>
                </div>`;
            
            if(fullGrid) fullGrid.innerHTML += html;
            // Only show first 3 items in Trending if no filter is active
            if(trendGrid && idx < 3 && filter === "") trendGrid.innerHTML += html;
        }
    });
}

function rotateBanner() {
    bannerIdx = (bannerIdx + 1) % banners.length;
    const img = document.getElementById('carousel-img');
    if(img) {
        img.style.opacity = 0;
        setTimeout(() => {
            img.src = banners[bannerIdx];
            img.style.opacity = 1;
        }, 500);
    }
}

// Improved Cart Logic
function askConfirm(name, price) {
    pendingItem = { name, price };
    const modal = document.getElementById('cart-modal');
    const msg = document.getElementById('modal-msg');
    const qtyBox = document.getElementById('qty-box');

    msg.innerText = `Add ${name} to your cart?`;
    qtyBox.style.display = 'none';
    modal.style.display = 'flex';
    
    document.getElementById('modal-yes').onclick = () => {
        if (qtyBox.style.display === 'none') {
            msg.innerText = "How many would you like?";
            qtyBox.style.display = 'block';
        } else {
            finalizeAdd();
        }
    };
}

function finalizeAdd() {
    const qty = parseInt(document.getElementById('item-qty').value) || 1;
    cart.push({ ...pendingItem, qty, id: Date.now() });
    updateCart();
    
    const name = pendingItem.name; // Store name for toast
    closeModal();
    showToast(`Added ${qty}x ${name} to cart!`);
}

function closeModal() {
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('item-qty').value = 1;
    pendingItem = null;
}

document.getElementById('modal-no').onclick = closeModal;

// Toast Notification Logic
function showToast(message) {
    let toast = document.getElementById('toast');
    if(!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = "position:fixed; bottom:20px; right:20px; background:var(--cream); color:black; padding:15px 25px; border-radius:30px; box-shadow:0 10px 20px rgba(0,0,0,0.2); z-index:3000; font-weight:bold;";
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

function updateCart() {
    updateCartCountDisplay();
    const list = document.getElementById('cart-items');
    if(!list) return;
    
    list.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        list.innerHTML += `<tr style="border-bottom: 1px solid var(--glass-border);">
            <td style="padding:15px">${item.name}</td><td>${item.qty}</td><td>$${item.price * item.qty}</td>
            <td><button onclick="removeItem(${item.id})" style="background:none; border:none; cursor:pointer; font-size:1.2rem;">❌</button></td></tr>`;
        total += (item.price * item.qty);
    });
    document.getElementById('total-price').innerText = total;
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
}

function loadCartFromStorage() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        return [];
    }
}

function saveCartToStorage() {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (err) {
        // Ignore storage errors (private mode, quota, etc.)
    }
}

function getCartQtyCount() {
    return cart.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 0), 0);
}

function updateCartCountDisplay() {
    const count = getCartQtyCount();
    document.querySelectorAll('#cart-count').forEach((el) => {
        el.innerText = count;
    });
    saveCartToStorage();
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo({top: 0, behavior: 'smooth'});
}
