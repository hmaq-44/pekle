document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');
    const orderForm = document.getElementById('order-form');
    const successMessage = document.getElementById('success-message');
    const totalPriceElement = document.getElementById('total-price').querySelector('span');
    
    // متغير لتخزين الطلب الحالي
    const cart = {};

    // ------------------------------------
    // وظيفة تحديث الإجمالي الكلي
    // ------------------------------------
    function updateTotalPrice() {
        let total = 0;
        for (const id in cart) {
            const item = cart[id];
            total += item.quantity * item.price;
        }
        totalPriceElement.textContent = total;
    }

    // ------------------------------------
    // منطق العدادات (اطلب، زيادة، نقصان)
    // ------------------------------------
    productCards.forEach(card => {
        const productId = card.dataset.productId;
        const price = parseInt(card.dataset.price);
        const requestBtn = card.querySelector('.request-btn');
        const counterDiv = card.querySelector('.counter');
        const countSpan = card.querySelector('.count');
        const plusBtn = card.querySelector('.plus-btn');
        const minusBtn = card.querySelector('.minus-btn');
        const flavourSelect = card.querySelector('.flavour-select');
        let quantity = 0;

        // عند الضغط على زر "اطلب"
        requestBtn.addEventListener('click', () => {
            requestBtn.style.display = 'none';
            counterDiv.style.display = 'flex';
            quantity = 1;
            countSpan.textContent = quantity;
            
            // إضافة المنتج للعربة
            cart[productId] = { 
                name: card.querySelector('h2').textContent,
                price: price,
                quantity: quantity,
                flavour: flavourSelect ? flavourSelect.value : null
            };
            updateTotalPrice();
        });

        // عند الضغط على زر الزيادة (+)
        plusBtn.addEventListener('click', () => {
            quantity++;
            countSpan.textContent = quantity;
            cart[productId].quantity = quantity;
            updateTotalPrice();
        });

        // عند الضغط على زر النقصان (-)
        minusBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                countSpan.textContent = quantity;
                cart[productId].quantity = quantity;
            } else if (quantity === 1) {
                // إذا وصل العدد لصفر، إخفاء العداد وإظهار زر "اطلب"
                quantity = 0;
                countSpan.textContent = quantity;
                requestBtn.style.display = 'block';
                counterDiv.style.display = 'none';
                delete cart[productId]; // إزالة المنتج من العربة
            }
            updateTotalPrice();
        });

        // عند تغيير نكهة الخضار المشكلة (حار/بارد)
        if (flavourSelect) {
            flavourSelect.addEventListener('change', () => {
                if (cart[productId]) {
                    cart[productId].flavour = flavourSelect.value;
                }
            });
        }
    });


    // ------------------------------------
    // منطق إرسال النموذج (الطلب)
    // ------------------------------------
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const customerName = document.getElementById('name').value;
        const customerPhone = document.getElementById('phone').value;
        const customerNotes = document.getElementById('notes').value;
        const total = totalPriceElement.textContent;

        // التأكد من وجود طلبات
        if (Object.keys(cart).length === 0) {
            alert('الرجاء إضافة منتج واحد على الأقل قبل إرسال الطلب.');
            return;
        }

        // بناء رسالة الطلب
        let orderDetails = '*طلب جديد من Pickle House*\n\n';
        orderDetails += `*بيانات العميل:*\n`;
        orderDetails += `الاسم: ${customerName}\n`;
        orderDetails += `الجوال: ${customerPhone}\n`;
        
        if (customerNotes) {
            orderDetails += `ملاحظات: ${customerNotes}\n`;
        }

        orderDetails += `\n*تفاصيل الطلب:*\n`;
        
        for (const id in cart) {
            const item = cart[id];
            const flavourText = item.flavour ? ` (${item.flavour})` : '';
            orderDetails += ` - ${item.name}${flavourText}: ${item.quantity} حبة × ${item.price} ريال = ${item.quantity * item.price} ريال\n`;
        }
        
        orderDetails += `\n*الإجمالي الكلي: ${total} ريال*`;

        // إخفاء النموذج وعرض رسالة النجاح (كما طلبت)
        orderForm.style.display = 'none';
        successMessage.style.display = 'block';

        // **هنا يتم استخدام رقم الواتساب الذي قمت بتعديله**
        const whatsappNumber = '966550786259'; // **غير هذا الرقم برقمك الصحيح قبل الحفظ!**
        const encodedMessage = encodeURIComponent(orderDetails);
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // فتح رابط واتساب جديد بعد تأكيد الطلب
        setTimeout(() => {
            window.open(whatsappURL, '_blank');
        }, 1500); // تأخير بسيط قبل فتح الواتساب
    });
});