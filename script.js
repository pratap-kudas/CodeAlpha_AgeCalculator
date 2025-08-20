// DOM Elements
const ageForm = document.getElementById('ageForm');
const dayInput = document.getElementById('day');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const yearsDisplay = document.getElementById('years');
const monthsDisplay = document.getElementById('months');
const daysDisplay = document.getElementById('days');
const totalDaysDisplay = document.getElementById('totalDays');

// Event Listeners
ageForm.addEventListener('submit', handleFormSubmit);
dayInput.addEventListener('input', validateDay);
monthInput.addEventListener('input', validateMonth);
yearInput.addEventListener('input', validateYear);

// Form submission handler
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Hide any previous results or errors
    hideResult();
    hideError();
    
    // Get input values
    const day = parseInt(dayInput.value);
    const month = parseInt(monthInput.value);
    const year = parseInt(yearInput.value);
    
    // Validate inputs
    if (!validateInputs(day, month, year)) {
        return;
    }
    
    // Calculate age
    const age = calculateAge(day, month, year);
    
    // Display result
    displayResult(age);
}

// Input validation functions
function validateDay() {
    const day = parseInt(dayInput.value);
    if (day < 1 || day > 31) {
        dayInput.style.borderColor = '#e53e3e';
        return false;
    }
    dayInput.style.borderColor = '#e2e8f0';
    return true;
}

function validateMonth() {
    const month = parseInt(monthInput.value);
    if (month < 1 || month > 12) {
        monthInput.style.borderColor = '#e53e3e';
        return false;
    }
    monthInput.style.borderColor = '#e2e8f0';
    return true;
}

function validateYear() {
    const year = parseInt(yearInput.value);
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
        yearInput.style.borderColor = '#e53e3e';
        return false;
    }
    yearInput.style.borderColor = '#e2e8f0';
    return true;
}

// Comprehensive input validation
function validateInputs(day, month, year) {
    // Check if all fields are filled
    if (!day || !month || !year) {
        showError('Please fill in all fields');
        return false;
    }
    
    // Validate day range
    if (day < 1 || day > 31) {
        showError('Day must be between 1 and 31');
        return false;
    }
    
    // Validate month range
    if (month < 1 || month > 12) {
        showError('Month must be between 1 and 12');
        return false;
    }
    
    // Validate year range
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
        showError(`Year must be between 1900 and ${currentYear}`);
        return false;
    }
    
    // Validate date existence
    const inputDate = new Date(year, month - 1, day);
    if (inputDate.getDate() !== day || inputDate.getMonth() !== month - 1 || inputDate.getFullYear() !== year) {
        showError('Invalid date. Please enter a valid date');
        return false;
    }
    
    // Check if date is in the future
    const today = new Date();
    if (inputDate > today) {
        showError('Date of birth cannot be in the future');
        return false;
    }
    
    return true;
}

// Age calculation function
function calculateAge(day, month, year) {
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    // Adjust for negative months or days
    if (days < 0) {
        months--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Calculate total days
    const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    
    return {
        years,
        months,
        days,
        totalDays
    };
}

// Display result with animation
function displayResult(age) {
    // Update display values
    yearsDisplay.textContent = age.years;
    monthsDisplay.textContent = age.months;
    daysDisplay.textContent = age.days;
    totalDaysDisplay.textContent = age.totalDays;
    
    // Show result with animation
    resultDiv.classList.remove('hidden');
    resultDiv.classList.add('show');
    
    // Animate numbers
    animateNumbers();
}

// Animate the age numbers
function animateNumbers() {
    const numbers = [yearsDisplay, monthsDisplay, daysDisplay];
    
    numbers.forEach((number, index) => {
        setTimeout(() => {
            number.style.transform = 'scale(1.1)';
            setTimeout(() => {
                number.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorDiv.classList.remove('hidden');
    
    // Add shake animation to form
    ageForm.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        ageForm.style.animation = '';
    }, 500);
}

// Hide result
function hideResult() {
    resultDiv.classList.add('hidden');
    resultDiv.classList.remove('show');
}

// Hide error
function hideError() {
    errorDiv.classList.add('hidden');
}

// Add shake animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Auto-focus first input on page load
window.addEventListener('load', () => {
    dayInput.focus();
});

// Real-time validation feedback
function addInputValidation() {
    const inputs = [dayInput, monthInput, yearInput];
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value) {
                input.classList.add('valid');
            } else {
                input.classList.remove('valid');
            }
        });
        
        input.addEventListener('input', () => {
            if (input.value) {
                input.classList.add('valid');
            }
        });
    });
}

// Initialize additional features
addInputValidation();

// Add keyboard navigation
ageForm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleFormSubmit(e);
    }
});

// Add input formatting
function formatInput(input, maxLength) {
    input.addEventListener('input', (e) => {
        let value = e.target.value;
        
        // Remove non-numeric characters
        value = value.replace(/\D/g, '');
        
        // Limit length
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
        }
        
        e.target.value = value;
    });
}

// Apply input formatting
formatInput(dayInput, 2);
formatInput(monthInput, 2);
formatInput(yearInput, 4);

// Add auto-tab functionality
function addAutoTab() {
    const inputs = [dayInput, monthInput, yearInput];
    
    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === e.target.maxLength && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
    });
}

addAutoTab();