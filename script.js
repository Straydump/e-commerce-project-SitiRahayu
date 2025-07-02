document.addEventListener('DOMContentLoaded', () => {
    // Konfigurasi opsi produk dengan metode konsumsi
    const productOptions = {
      cimol: [
        { label: 'Level', name: 'level', type: 'select', values: ['Ringan', 'Sedang', 'Pedas'] },
        { label: 'Rasa', name: 'flavor', type: 'select', values: ['Asin pedas', 'Keju jagung', 'Barbeque'] },
        { label: 'Metode Konsumsi', name: 'consumption', type: 'radio', values: ['Makan di Tempat', 'Take Away'] }
      ],
      wonton: [
        { label: 'Level', name: 'level', type: 'select', values: ['Tidak Pedas', 'Sedang', 'Pedas'] },
        { label: 'Saus', name: 'sauce', type: 'select', values: ['Manis', 'Asam', 'Pedas'] },
        { label: 'Metode Konsumsi', name: 'consumption', type: 'radio', values: ['Makan di Tempat', 'Take Away'] }
      ],
      pisang: [
        { label: 'Toping', name: 'topping', type: 'select', values: ['Coklat', 'Keju', 'meses'] },
        { label: 'Metode Konsumsi', name: 'consumption', type: 'radio', values: ['Makan di Tempat', 'Take Away'] }
      ],
      dimsum: [
        { label: 'Level', name: 'level', type: 'select', values: ['Pake Chili oil', 'Pake Saus Biasa'] },
        { label: 'Jenis dimsum', name: 'jenis_dimsum', type: 'select', values: ['Dimsum Biasa', 'Dimsum Mentai'] },
        { label: 'Metode Konsumsi', name: 'consumption', type: 'radio', values: ['Makan di Tempat', 'Take Away'] }
      ],
      escincau: [
        { label: 'Ukuran', name: 'size', type: 'select', values: ['Kecil', 'Sedang', 'Besar'] },
        { label: 'Tambahan', name: 'addition', type: 'select', values: ['Tidak ada', 'Susu', 'Boba'] },
        { label: 'Metode Konsumsi', name: 'consumption', type: 'radio', values: ['Makan di Tempat', 'Take Away'] }
      ],
      escendol: [
        { label: 'Ukuran', name: 'size', type: 'select', values: ['Kecil', 'Sedang', 'Besar'] },
        { label: 'Warna', name: 'collor', type: 'select', values: ['Hijau', 'Merah', 'Hitam'] },
        { label: 'Metode Konsumsi', name: 'consumption', type: 'radio', values: ['Makan di Tempat', 'Take Away'] }
      ],
    };
  
    const cartCount = document.getElementById('cart-count');
    const cartItemsList = document.getElementById('cart-items');
    const cartEmptyText = document.getElementById('cart-empty');
    const cartTotalSection = document.getElementById('cart-total');
    const totalPriceElem = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');
  
    const modal = document.getElementById('optionModal');
    const closeModalBtn = document.getElementById('closeModal');
    const optionForm = document.getElementById('optionForm');
  
    let cart = [];
    let currentProduct = null;
  
    // Simpan keranjang ke localStorage
    function saveCartToStorage() {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  
    // Load keranjang dari localStorage
    function loadCartFromStorage() {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        cart = JSON.parse(storedCart);
      }
    }
  
    // Update jumlah item di tombol keranjang
    function updateCartCountUI() {
      if (!cartCount) return;
      cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    }
  
    // Update tampilan isi keranjang (jika ada dropdown)
    function updateCartUI() {
      if (!cartItemsList) return;
  
      cartItemsList.innerHTML = '';
  
      if (cart.length === 0) {
        cartEmptyText.style.display = 'block';
        cartTotalSection.style.display = 'none';
        updateCartCountUI();
        return;
      }
  
      cartEmptyText.style.display = 'none';
      cartTotalSection.style.display = 'block';
  
      let total = 0;
      cart.forEach((item, index) => {
        total += item.price * item.quantity;
  
        let optionsStr = '';
        if (item.options) {
          optionsStr = Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(', ');
        }
  
        const li = document.createElement('li');
        li.textContent = `${item.name} (${optionsStr}) x${item.quantity} - Rp${(item.price * item.quantity).toLocaleString('id-ID')}`;
  
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Hapus';
        removeBtn.style.marginLeft = '10px';
        removeBtn.addEventListener('click', () => {
          cart.splice(index, 1);
          updateCartUI();
          updateCartCountUI();
          saveCartToStorage();
        });
  
        li.appendChild(removeBtn);
        cartItemsList.appendChild(li);
      });
  
      totalPriceElem.textContent = total.toLocaleString('id-ID');
      updateCartCountUI();
      saveCartToStorage();
    }
  
    // Event klik tombol tambah ke keranjang
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
        currentProduct = {
          id: button.dataset.productId,
          name: button.dataset.name,
          price: parseInt(button.dataset.price),
        };
  
        // Bangun form modal dinamis sesuai produk
        const form = optionForm;
        form.innerHTML = '';
  
        const options = productOptions[currentProduct.id] || [];
  
        options.forEach(opt => {
          const label = document.createElement('label');
          label.textContent = opt.label + ':';
          form.appendChild(label);
          form.appendChild(document.createElement('br'));
  
          if (opt.type === 'select') {
            const select = document.createElement('select');
            select.name = opt.name;
            select.required = true;
            opt.values.forEach(val => {
              const option = document.createElement('option');
              option.value = val;
              option.textContent = val;
              select.appendChild(option);
            });
            form.appendChild(select);
          } else if (opt.type === 'radio') {
            opt.values.forEach(val => {
              const radio = document.createElement('input');
              radio.type = 'radio';
              radio.name = opt.name;
              radio.value = val;
              radio.required = true;
              const radioLabel = document.createElement('label');
              radioLabel.textContent = val;
              radioLabel.style.marginRight = '10px';
  
              form.appendChild(radio);
              form.appendChild(radioLabel);
            });
          }
  
          form.appendChild(document.createElement('br'));
          form.appendChild(document.createElement('br'));
        });
  
        if (!form.querySelector('button[type="submit"]')) {
          const submitBtn = document.createElement('button');
          submitBtn.type = 'submit';
          submitBtn.textContent = 'Tambahkan ke Keranjang';
          form.appendChild(submitBtn);
        }
  
        modal.style.display = 'flex';
      });
    });
  
    // Tutup modal
    closeModalBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      optionForm.reset();
    });
  
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        optionForm.reset();
      }
    });
  
    // Submit form modal
    optionForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const formData = new FormData(optionForm);
      const selectedOptions = {};
      for (const [key, value] of formData.entries()) {
        selectedOptions[key] = value;
      }
  
      const item = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        options: selectedOptions,
        quantity: 1,
      };
  
      // Cek apakah item dengan opsi sama sudah ada
      const existingIndex = cart.findIndex(cartItem =>
        cartItem.id === item.id &&
        JSON.stringify(cartItem.options) === JSON.stringify(item.options)
      );
  
      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push(item);
      }
  
      updateCartUI();
      updateCartCountUI();
      saveCartToStorage();
  
      modal.style.display = 'none';
      optionForm.reset();
  
      alert(`${item.name} berhasil ditambahkan ke keranjang!`);
    });
  
    // Checkout (jika ada tombol checkout)
    if (checkoutButton) {
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
        updateCartCountUI();
        saveCartToStorage();
      });
    }
  
    // Load data keranjang saat halaman dimuat
    loadCartFromStorage();
    updateCartUI();
    updateCartCountUI();
  });
  
