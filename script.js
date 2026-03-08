/* ═══════════════════════════════════════════════════════════
   GAME CHARACTER STORE — SCRIPT.JS
   Modal, Toast, Sidebar, and API Integration
   ═══════════════════════════════════════════════════════════ */


/* ── API BASE URL ───────────────────────────────────────── */
const API_BASE = "http://localhost:3000/api";


/* ── CHARACTER DATA (for modal use) ─────────────────────── */
const characters = {
    "1": { name: "Iron Hook",      type: "Tank",    price: 29.99, image: "assets/background-remover/Whisk_0988bec7832708da9ba41e3fd34b1277dr (1).png" },
    "2": { name: "Scarlett Blade",  type: "Rogue",   price: 34.99, image: "assets/background-remover/Whisk_73673ecf4a3e08e9f444171255797687dr (1).png" },
    "3": { name: "Nita & Bruce",    type: "Brawler", price: 39.99, image: "assets/background-remover/Whisk_7776c230ca6a12da8804831e281bf35edr (1).png" },
    "5": { name: "Sylvan Arrow",    type: "Archer",  price: 32.99, image: "assets/background-remover/Whisk_7fbacb49e24966e98f2499bd4cd5d15ddr (1).png" },
    "7": { name: "Hog Hammer",      type: "Warrior", price: 37.99, image: "assets/background-remover/Whisk_d5e47c9f35e3ac890354dd46c32209a2dr (1).png" }
};


/* ── MODAL ELEMENTS ─────────────────────────────────────── */
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalType = document.getElementById("modalType");
const unitPriceDisplay = document.getElementById("unitPrice");
const totalPriceDisplay = document.getElementById("totalPrice");
const quantityInput = document.getElementById("quantity");
const purchaseForm = document.getElementById("purchaseForm");
const buyerNameInput = document.getElementById("buyerName");

let currentCharacter = null;


/* ── OPEN MODAL ─────────────────────────────────────────── */
function openModal(id) {
    currentCharacter = characters[id];
    if (!currentCharacter) return;

    modalImg.src = currentCharacter.image;
    modalImg.alt = currentCharacter.name;
    modalName.textContent = currentCharacter.name;
    modalType.textContent = currentCharacter.type;
    unitPriceDisplay.textContent = "$" + currentCharacter.price.toFixed(2);
    quantityInput.value = 1;
    buyerNameInput.value = "";
    updateTotal();

    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}


/* ── CLOSE MODAL ────────────────────────────────────────── */
function closeModal() {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
    currentCharacter = null;
}


/* ── UPDATE TOTAL ───────────────────────────────────────── */
function updateTotal() {
    if (!currentCharacter) return;
    const qty = parseInt(quantityInput.value) || 1;
    const total = qty * currentCharacter.price;
    totalPriceDisplay.textContent = "$" + total.toFixed(2);
}


/* ── BUY BUTTON CLICKS ─────────────────────────────────── */
const allBuyButtons = document.querySelectorAll(".btn-get");

allBuyButtons.forEach((btn) => {
    btn.addEventListener("click", function() {
        const id = this.getAttribute("data-id");
        openModal(id);
    });
});


/* ── CLOSE EVENTS ───────────────────────────────────────── */
modalClose.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});


/* ── QUANTITY CHANGE ────────────────────────────────────── */
quantityInput.addEventListener("input", updateTotal);


/* ── FORM SUBMIT ────────────────────────────────────────── */
purchaseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!currentCharacter) return;

    const qty = parseInt(quantityInput.value) || 1;

    const orderData = {
        characterId: Object.keys(characters).find((key) => characters[key].name === currentCharacter.name),
        characterName: currentCharacter.name,
        characterType: currentCharacter.type,
        characterImage: currentCharacter.image,
        buyerName: buyerNameInput.value.trim(),
        quantity: qty,
        pricePerUnit: currentCharacter.price,
        totalPrice: qty * currentCharacter.price
    };

    // Send to backend API
    fetch(API_BASE + "/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
    })
    .then((response) => {
        if (!response.ok) throw new Error("Failed to place order");
        return response.json();
    })
    .then((data) => {
        closeModal();
        showToast("Order placed for " + qty + "x " + currentCharacter.name + "! 🎉");
    })
    .catch((error) => {
        console.error("Order error:", error);
        closeModal();
        showToast("Failed to place order. Please try again.", "error");
    });
});


/* ── TOAST ──────────────────────────────────────────────── */
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const toastIcon = toast.querySelector(".toast-icon");

function showToast(message, type) {
    toastMessage.textContent = message;
    toast.classList.remove("error");
    
    if (type === "error") {
        toast.classList.add("error");
        toastIcon.textContent = "❌";
    } else {
        toastIcon.textContent = "✅";
    }
    
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


/* ── SMOOTH SCROLL ──────────────────────────────────────── */
const browseCta = document.getElementById("browseCta");

browseCta.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("characters").scrollIntoView({ behavior: "smooth" });
});


/* ── NAVBAR SCROLL EFFECT ───────────────────────────────── */
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});


/* ══════════════════════════════════════════════════════════
   ORDERS SIDEBAR
   ══════════════════════════════════════════════════════════ */
const ordersBtn = document.getElementById("ordersBtn");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const ordersSidebar = document.getElementById("ordersSidebar");
const sidebarClose = document.getElementById("sidebarClose");
const sidebarBody = document.getElementById("sidebarBody");
const sidebarEmpty = document.getElementById("sidebarEmpty");
const sidebarTotalPrice = document.getElementById("sidebarTotalPrice");
const btnOrderNow = document.getElementById("btnOrderNow");

let currentOrders = [];


/* ── OPEN SIDEBAR ───────────────────────────────────────── */
function openSidebar() {
    sidebarOverlay.classList.add("active");
    ordersSidebar.classList.add("active");
    document.body.style.overflow = "hidden";
    fetchOrders();
}


/* ── CLOSE SIDEBAR ──────────────────────────────────────── */
function closeSidebar() {
    sidebarOverlay.classList.remove("active");
    ordersSidebar.classList.remove("active");
    document.body.style.overflow = "";
}


/* ── FETCH ORDERS FROM BACKEND ──────────────────────────── */
function fetchOrders() {
    fetch(API_BASE + "/orders")
        .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch orders");
            return response.json();
        })
        .then((orders) => {
            currentOrders = orders;
            renderOrders(orders);
        })
        .catch((error) => {
            console.error("Fetch orders error:", error);
            sidebarBody.innerHTML = '<div class="sidebar-empty"><p>Failed to load orders</p></div>';
        });
}


/* ── RENDER ORDERS IN SIDEBAR ───────────────────────────── */
function renderOrders(orders) {
    if (!orders || orders.length === 0) {
        sidebarBody.innerHTML = '<div class="sidebar-empty"><p>No orders yet</p></div>';
        sidebarTotalPrice.textContent = "$0.00";
        btnOrderNow.disabled = true;
        return;
    }

    let html = "";
    let grandTotal = 0;

    for (const order of orders) {
        grandTotal += order.totalPrice;

        html += '<div class="order-item">';
        html += '  <div class="order-item-img"><img src="' + order.characterImage + '" alt="' + order.characterName + '"></div>';
        html += '  <div class="order-item-info">';
        html += '    <div class="order-item-name">' + order.characterName + '</div>';
        html += '    <div class="order-item-buyer">Buyer: ' + order.buyerName + '</div>';
        html += '    <div class="order-item-meta">';
        html += '      <span class="order-item-qty">x' + order.quantity + '</span>';
        html += '      <span class="order-item-price">$' + order.totalPrice.toFixed(2) + '</span>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';
    }

    sidebarBody.innerHTML = html;
    sidebarTotalPrice.textContent = "$" + grandTotal.toFixed(2);
    btnOrderNow.disabled = false;
}


/* ── ORDER NOW BUTTON ───────────────────────────────────── */
btnOrderNow.addEventListener("click", () => {
    if (currentOrders.length === 0) return;

    fetch(API_BASE + "/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    .then((response) => {
        if (!response.ok) throw new Error("Checkout failed");
        return response.json();
    })
    .then((data) => {
        closeSidebar();
        showToast("Order completed successfully! 🎉");
    })
    .catch((error) => {
        console.error("Checkout error:", error);
        showToast("Checkout failed. Please try again.", "error");
    });
});


/* ── SIDEBAR EVENT LISTENERS ────────────────────────────── */
ordersBtn.addEventListener("click", openSidebar);
sidebarClose.addEventListener("click", closeSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);
