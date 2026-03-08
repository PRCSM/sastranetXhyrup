// Step 1: Character data and modal open/close

const characters = {
    "1": { name: "Iron Hook", type: "Tank", price: 29.99, image: "assets/background-remover/Whisk_0988bec7832708da9ba41e3fd34b1277dr (1).png" },
    "2": { name: "Scarlett Blade", type: "Rogue", price: 34.99, image: "assets/background-remover/Whisk_73673ecf4a3e08e9f444171255797687dr (1).png" },
    "3": { name: "Nita & Bruce", type: "Brawler", price: 39.99, image: "assets/background-remover/Whisk_7776c230ca6a12da8804831e281bf35edr (1).png" },
    "5": { name: "Sylvan Arrow", type: "Archer", price: 32.99, image: "assets/background-remover/Whisk_7fbacb49e24966e98f2499bd4cd5d15ddr (1).png" },
    "7": { name: "Hog Hammer", type: "Warrior", price: 37.99, image: "assets/background-remover/Whisk_d5e47c9f35e3ac890354dd46c32209a2dr (1).png" }
};

const modal = document.getElementById("modalOverlay");
const quantity = document.getElementById("quantity");
const totalPrice = document.getElementById("totalPrice");
let currentChar = null;

// Open modal when clicking "Get It"
document.querySelectorAll(".btn-get").forEach(btn => {
    btn.onclick = () => {
        const id = btn.dataset.id;
        currentChar = characters[id];
        document.getElementById("modalImg").src = currentChar.image;
        document.getElementById("modalName").textContent = currentChar.name;
        document.getElementById("modalType").textContent = currentChar.type;
        document.getElementById("unitPrice").textContent = "$" + currentChar.price.toFixed(2);
        document.getElementById("buyerName").value = "";
        quantity.value = 1;
        updateTotal();
        modal.classList.add("active");
    };
});

// Close modal
document.getElementById("modalClose").onclick = () => modal.classList.remove("active");
modal.onclick = (e) => { if (e.target === modal) modal.classList.remove("active"); };

// Step 2: Form with quantity and price calculation
function updateTotal() {
    const total = (parseInt(quantity.value) || 1) * currentChar.price;
    totalPrice.textContent = "$" + total.toFixed(2);
}

quantity.oninput = updateTotal;

// Step 3: Purchase saves to localStorage
let orders = JSON.parse(localStorage.getItem("orders")) || [];

document.getElementById("purchaseForm").onsubmit = (e) => {
    e.preventDefault();
    const qty = parseInt(quantity.value) || 1;
    const name = document.getElementById("buyerName").value.trim();
    if (!name) return alert("Enter your name");

    orders.push({
        name: currentChar.name,
        image: currentChar.image,
        buyer: name,
        qty: qty,
        total: qty * currentChar.price
    });
    localStorage.setItem("orders", JSON.stringify(orders));
    modal.classList.remove("active");
    showToast("Order placed: " + qty + "x " + currentChar.name);
};

// Toast notification
function showToast(msg) {
    const toast = document.getElementById("toast");
    document.getElementById("toastMessage").textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}