/**
 * Contact Form Module
 * Handles form validation, submission, and user feedback
 */

class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.submitBtn = document.querySelector('.submit-btn');
        this.successMessage = document.querySelector('.form-success');
        
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            subject: {
                required: true,
                minLength: 5
            },
            message: {
                required: true,
                minLength: 10
            }
        };

        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.bindEvents();
        this.createSuccessMessage();
    }

    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearFieldError(e.target));
        });

        // Floating labels
        this.initFloatingLabels();
    }

    createSuccessMessage() {
        if (!this.successMessage) {
            this.successMessage = document.createElement('div');
            this.successMessage.className = 'form-success';
            this.form.insertBefore(this.successMessage, this.form.firstChild);
        }
    }

    initFloatingLabels() {
        const formGroups = this.form.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                group.classList.add('floating');
                
                // Move label after input for CSS sibling selector
                if (input.nextElementSibling !== label) {
                    input.parentNode.insertBefore(label, input.nextElementSibling);
                }
            }
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        if (!this.validateForm()) {
            this.showError('Please fix the errors below and try again.');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Get form data
            const formData = this.getFormData();
            
            // Simulate API call (replace with actual endpoint)
            const success = await this.submitForm(formData);
            
            if (success) {
                this.showSuccess('Message sent successfully! I will get back to you soon.');
                this.resetForm();
            } else {
                this.showError('Failed to send message. Please try again later.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('An error occurred. Please try again later.');
        } finally {
            this.setLoadingState(false);
        }
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const fieldName = field.name || field.type;
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;

        // Clear previous errors
        this.clearFieldError(field);

        // Required validation
        if (rules.required && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }

        // Skip other validations if field is empty and not required
        if (!value && !rules.required) return true;

        // Minimum length validation
        if (rules.minLength && value.length < rules.minLength) {
            this.showFieldError(field, `Must be at least ${rules.minLength} characters`);
            return false;
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            let message = 'Invalid format';
            
            if (fieldName === 'email') {
                message = 'Please enter a valid email address';
            } else if (fieldName === 'name') {
                message = 'Please enter a valid name (letters and spaces only)';
            }
            
            this.showFieldError(field, message);
            return false;
        }

        // Mark field as valid
        this.markFieldValid(field);
        return true;
    }

    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        formGroup.classList.remove('success');

        let errorElement = formGroup.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            formGroup.appendChild(errorElement);
        }

        errorElement.textContent = message;
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        
        const errorElement = formGroup.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    markFieldValid(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('success');
        formGroup.classList.remove('error');
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        // Convert FormData to regular object
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Add additional data if needed
        data.timestamp = new Date().toISOString();
        data.userAgent = navigator.userAgent;
        
        return data;
    }

    async submitForm(data) {
        // مؤقتاً: بيعرض البيانات في الـ console للتجربة
        console.log('📧 Contact Form Data:', data);
        
        // إشعار للمستخدم أن الـ form مش شغال فعلياً بعد
        alert(`📨 تم استلام رسالتك (للتجربة فقط):
        
الاسم: ${data.name}
الإيميل: ${data.email}
الموضوع: ${data.subject}
الرسالة: ${data.message}

⚠️ ملاحظة: دي مجرد تجربة. الرسالة مش هتوصل فعلياً.
لو عايز تفعل الإرسال الحقيقي، راجع README.md`);
        
        // Simulate success for demo
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true); // دايماً بيرجع success للتجربة
            }, 1000);
        });

        // 🔧 لتفعيل الإرسال الحقيقي، استخدم واحد من الحلول دي:
        
        // 1️⃣ استخدام Netlify Forms (الأسهل لو الموقع على Netlify):
        /*
        const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                'form-name': 'contact',
                ...data
            })
        });
        return response.ok;
        */
        
        // 2️⃣ استخدام EmailJS (مجاني ومباشر):
        /*
        try {
            await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', data, 'YOUR_PUBLIC_KEY');
            return true;
        } catch (error) {
            console.error('EmailJS Error:', error);
            return false;
        }
        */
        
        // 3️⃣ استخدام Formspree (بسيط ومجاني):
        /*
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.ok;
        */
        
        // 4️⃣ Backend خاص بيك (Node.js, PHP, Python, etc.):
        /*
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.ok;
        */
    }

    setLoadingState(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.submitBtn.textContent = 'Sending...';
            this.form.classList.add('form-loading');
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = 'Send Message';
            this.form.classList.remove('form-loading');
        }
    }

    showSuccess(message) {
        this.successMessage.textContent = message;
        this.successMessage.classList.add('show');
        
        // Hide after 5 seconds
        setTimeout(() => {
            this.successMessage.classList.remove('show');
        }, 5000);
    }

    showError(message) {
        // You could create an error message element similar to success
        alert(message); // Simple fallback for now
    }

    resetForm() {
        this.form.reset();
        
        // Clear all validation states
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
        });

        // Remove all error messages
        const errorElements = this.form.querySelectorAll('.form-error');
        errorElements.forEach(element => element.remove());
    }

    // Public method to programmatically validate
    isValid() {
        return this.validateForm();
    }

    // Public method to get form data
    getData() {
        return this.getFormData();
    }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactForm;
} else {
    window.ContactForm = ContactForm;
}
