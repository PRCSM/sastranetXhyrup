/* ═══════════════════════════════════════════════════════════
   GAME CHARACTER STORE — SCRIPT.JS
   Modal, Toast, and Smooth Scroll only
   ═══════════════════════════════════════════════════════════ */


/* ── CHARACTER DATA (for modal use) ─────────────────────── */
var characters = {
    "1": { name: "Iron Hook",      type: "Tank",    price: 29.99, image: "assets/background-remover/Whisk_0988bec7832708da9ba41e3fd34b1277dr (1).png" },
    "2": { name: "Scarlett Blade",  type: "Rogue",   price: 34.99, image: "assets/background-remover/Whisk_73673ecf4a3e08e9f444171255797687dr (1).png" },
    "3": { name: "Nita & Bruce",    type: "Brawler", price: 39.99, image: "assets/background-remover/Whisk_7776c230ca6a12da8804831e281bf35edr (1).png" },
    "5": { name: "Sylvan Arrow",    type: "Archer",  price: 32.99, image: "assets/background-remover/Whisk_7fbacb49e24966e98f2499bd4cd5d15ddr (1).png" },
    "7": { name: "Hog Hammer",      type: "Warrior", price: 37.99, image: "assets/background-remover/Whisk_d5e47c9f35e3ac890354dd46c32209a2dr (1).png" }
};


/* ── MODAL ELEMENTS ─────────────────────────────────────── */
var modalOverlay = document.getElementById("modalOverlay");
var modalClose = document.getElementById("modalClose");
var modalImg = document.getElementById("modalImg");
var modalName = document.getElementById("modalName");
var modalType = document.getElementById("modalType");
var unitPriceDisplay = document.getElementById("unitPrice");
var totalPriceDisplay = document.getElementById("totalPrice");
var quantityInput = document.getElementById("quantity");
var purchaseForm = document.getElementById("purchaseForm");
var buyerNameInput = document.getElementById("buyerName");

var currentCharacter = null;


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
    var qty = parseInt(quantityInput.value) || 1;
    var total = qty * currentCharacter.price;
    totalPriceDisplay.textContent = "$" + total.toFixed(2);
}


/* ── BUY BUTTON CLICKS ─────────────────────────────────── */
var allBuyButtons = document.querySelectorAll(".btn-get");

for (var i = 0; i < allBuyButtons.length; i++) {
    allBuyButtons[i].addEventListener("click", function (e) {
        var id = this.getAttribute("data-id");
        openModal(id);
    });
}


/* ── CLOSE EVENTS ───────────────────────────────────────── */
modalClose.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
        closeModal();
    }
});


/* ── QUANTITY CHANGE ────────────────────────────────────── */
quantityInput.addEventListener("input", updateTotal);


/* ── FORM SUBMIT ────────────────────────────────────────── */
purchaseForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!currentCharacter) return;

    var qty = parseInt(quantityInput.value) || 1;

    var orderData = {
        characterName: currentCharacter.name,
        characterType: currentCharacter.type,
        buyerName: buyerNameInput.value.trim(),
        quantity: qty,
        pricePerUnit: currentCharacter.price,
        totalPrice: qty * currentCharacter.price
    };

    // Placeholder: replace with fetch() for backend integration
    console.log("📦 Order Data:", orderData);

    closeModal();
    showToast("Order placed for " + qty + "x " + currentCharacter.name + "! 🎉");
});


/* ── TOAST ──────────────────────────────────────────────── */
var toast = document.getElementById("toast");
var toastMessage = document.getElementById("toastMessage");

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add("show");
    setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}


/* ── SMOOTH SCROLL ──────────────────────────────────────── */
var browseCta = document.getElementById("browseCta");

browseCta.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("characters").scrollIntoView({ behavior: "smooth" });
});


/* ── NAVBAR SCROLL EFFECT ───────────────────────────────── */
var navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});
