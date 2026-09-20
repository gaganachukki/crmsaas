document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const body = item.querySelector('.accordion-body');
            const icon = header.querySelector('i');
            
            // Close all others
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-body').style.display = 'none';
                    otherItem.querySelector('i').classList.replace('fa-minus', 'fa-plus');
                }
            });

            // Toggle current
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                body.style.display = 'none';
                icon.classList.replace('fa-minus', 'fa-plus');
            } else {
                item.classList.add('active');
                body.style.display = 'block';
                icon.classList.replace('fa-plus', 'fa-minus');
            }
        });
    });

    // Pricing Toggle
    const toggleInput = document.getElementById('billing-toggle');
    const amounts = document.querySelectorAll('.amount');
    
    if(toggleInput) {
        toggleInput.addEventListener('change', (e) => {
            if (e.target.checked) {
                // Annually
                amounts[0].innerText = '290';
                amounts[1].innerText = '990';
                amounts[2].innerText = '2990';
                document.querySelectorAll('.period').forEach(p => p.innerText = '/yr');
            } else {
                // Monthly
                amounts[0].innerText = '29';
                amounts[1].innerText = '99';
                amounts[2].innerText = '299';
                document.querySelectorAll('.period').forEach(p => p.innerText = '/mo');
            }
        });
    }

    // Tabs Interaction
    const tabItems = document.querySelectorAll('.tab-item');
    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            tabItems.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
});
