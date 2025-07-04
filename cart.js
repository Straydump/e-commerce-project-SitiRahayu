document.addEventListener('DOMContentLoaded', () => {
    const cartItemsList = document.getElementById('cart-items');
    const cartEmptyText = document.getElementById('cart-empty');
    const cartTotalSection = document.getElementById('cart-total');
    const totalPriceElem = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');
  
    let cart = [];
  
    function loadCartFromStorage() {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        cart = JSON.parse(storedCart);
      }
    }
  
    function saveCartToStorage() {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  
    function updateCartUI() {
      cartItemsList.innerHTML = '';
  
      if (cart.length === 0) {
        cartEmptyText.style.display = 'block';
        cartTotalSection.style.display = 'none';
        return;
      }
  
      cartEmptyText.style.display = 'none';
      cartTotalSection.style.display = 'block';
  
      let total = 0;
      cart.forEach((item, index) => {
        total += item.price * item.quantity;
  
        const li = document.createElement('li');
        li.textContent = `${item.name} (${item.level}, ${item.flavor}, ${item.consumption}) x${item.quantity} - Rp${(item.price * item.quantity).toLocaleString('id-ID')}`;
  
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Hapus';
        removeBtn.style.marginLeft = '10px';
        removeBtn.addEventListener('click', () => {
          cart.splice(index, 1);
          updateCartUI();
          saveCartToStorage();
        });
  
        li.appendChild(removeBtn);
        cartItemsList.appendChild(li);
      });
  
      totalPriceElem.textContent = total.toLocaleString('id-ID');
      saveCartToStorage();
    }
  
    checkoutButton.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Keranjang kosong! Silakan tambahkan produk terlebih dahulu.');
        return;
      }
  
      const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
      if (!paymentMethod) {
        alert('Silakan pilih metode pembayaran terlebih dahulu.');
        return;
      }
  
      alert(`Terima kasih telah melakukan pembelian.\nMetode pembayaran: ${paymentMethod.value}\nTotal: Rp${totalPriceElem.textContent}`);
  
      cart = [];
      updateCartUI();
      saveCartToStorage();
    });
  
    loadCartFromStorage();
    updateCartUI();
  });
  