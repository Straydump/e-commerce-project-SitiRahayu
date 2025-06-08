const cartButton = document.getElementById('cart-button');
const cartDropdown = document.getElementById('cart-dropdown');
const cartItemsList = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');
const cartTotal = document.getElementById('cart-total');
const totalPriceElem = document.getElementById('total-price');

let cart = [];

// Toggle dropdown keranjang
cartButton.addEventListener('click', () => {
  if (cartDropdown.style.display === 'block') {
    cartDropdown.style.display = 'none';
  } else {
    cartDropdown.style.display = 'block';
  }
});

// Update tampilan keranjang
function updateCart() {
  cartItemsList.innerHTML = '';
  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartTotal.classList.add('hidden');
    cartCount.textContent = 0;
    totalPriceElem.textContent = '0';
  } else {
    cartEmpty.style.display = 'none';
    cartTotal.classList.remove('hidden');
    cartCount.textContent = cart.length;

    cart.forEach((item, index) => {
      const li = document.createElement('li');
      const nameSpan = document.createElement('span');
      nameSpan.textContent = `${item.name}` - Rp`${item.price.toLocaleString()}`;
      nameSpan.classList.add('cart-item-name');

      // Tambahkan event klik untuk menampilkan detail produk
      nameSpan.style.cursor = 'pointer';
      nameSpan.addEventListener('click', () => {
        alert(`Detail produk:\nNama: ${item.name}\nHarga: Rp${item.price.toLocaleString()}`);
      });

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Hapus';
      removeBtn.classList.add('remove-item-btn');
      removeBtn.addEventListener('click', () => {
        removeItem(index);
      });

      li.appendChild(nameSpan);
      li.appendChild(removeBtn);
      cartItemsList.appendChild(li);
    });

    // Hitung total harga
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalPriceElem.textContent = total.toLocaleString();
  }
}

// Tambah produk ke keranjang
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const name = button.getAttribute('data-name');
    const price = parseInt(button.getAttribute('data-price'));
    cart.push({ name, price });
    updateCart();
    alert(`${name} berhasil ditambahkan ke keranjang!`);
  });
});

// Hapus item dari keranjang berdasarkan index
function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

// Sembunyikan dropdown jika klik di luar
window.addEventListener('click', (e) => {
  if (
    cartButton && cartDropdown &&
    !cartButton.contains(e.target) &&
    !cartDropdown.contains(e.target)
  ) {
    cartDropdown.style.display = 'none';
  }
});