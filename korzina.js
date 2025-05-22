document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.product-card button.buy-btn:not([disabled])');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const clearCartButton = document.getElementById('clear-cart-button');
    const cartElement = document.getElementById('cart');
    let cart = [];

    // Функция для обновления отображения корзины
    function updateCartDisplay() {
        cartItemsList.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('cart-item');
            listItem.innerHTML = `
                <span class="cart-item-name">${item.name}</span>
                <div class="cart-item-quantity">
                    <button class="decrease" data-id="${item.id}" aria-label="Уменьшить количество">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase" data-id="${item.id}" aria-label="Увеличить количество">+</button>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)} руб.</span>
            `;
            cartItemsList.appendChild(listItem);
            total += item.price * item.quantity;
        });

        cartTotalElement.textContent = `Итого: ${total.toFixed(2)} руб.`;
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Показываем/скрываем кнопку очистки в зависимости от содержимого корзины
        if (clearCartButton) {
            clearCartButton.style.display = cart.length ? 'block' : 'none';
        }

        // Анимация обновления корзины
        cartElement.classList.add('cart-updated');
        setTimeout(() => {
            cartElement.classList.remove('cart-updated');
        }, 500);
    }

    // Функция для добавления товара в корзину
    function addItemToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: 1
            });
        }

        updateCartDisplay();
    }

    // Функция для изменения количества товара
    function changeQuantity(id, amount) {
        const item = cart.find(item => item.id === id);
        if (!item) return;

        item.quantity += amount;

        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }

        updateCartDisplay();
    }

    // Функция для очистки корзины
    function clearCart() {
        if (cart.length === 0) return;
        
        if (confirm('Вы уверены, что хотите очистить корзину?')) {
            cart = [];
            updateCartDisplay();
        }
    }

    // Обработчики событий для кнопок "Купить"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const id = productCard.querySelector('h3').textContent;
            const name = productCard.querySelector('h3').textContent;
            const priceText = productCard.querySelector('.main-price').textContent;
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
            
            addItemToCart(id, name, price);
        });
    });

    // Обработчики событий для кнопок увеличения/уменьшения количества
    cartItemsList.addEventListener('click', function(event) {
        if (event.target.classList.contains('decrease')) {
            const id = event.target.dataset.id;
            changeQuantity(id, -1);
        } else if (event.target.classList.contains('increase')) {
            const id = event.target.dataset.id;
            changeQuantity(id, 1);
        }
    });

    // Обработчик событий для кнопки "Очистить корзину"
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }

    // Загрузка корзины из localStorage при загрузке страницы
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartDisplay();
    }
});