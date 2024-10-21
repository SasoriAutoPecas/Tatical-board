document.getElementById('loginBtn').onclick = function () {
    const loginModal = document.getElementById('loginModal');
    loginModal.style.display = 'flex'; 
    loginModal.classList.add('show'); 
}


document.getElementById('registerBtn').onclick = function () {
    const registerModal = document.getElementById('registerModal');
    registerModal.style.display = 'flex'; 
    registerModal.classList.add('show'); 
}


document.getElementById('closeLogin').onclick = function () {
    const loginModal = document.getElementById('loginModal');
    loginModal.classList.remove('show'); 
    setTimeout(() => loginModal.style.display = 'none', 300); 
}


document.getElementById('closeRegister').onclick = function () {
    const registerModal = document.getElementById('registerModal');
    registerModal.classList.remove('show'); 
    setTimeout(() => registerModal.style.display = 'none', 300); 
}


window.onclick = function (event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');

    if (event.target == loginModal) {
        loginModal.classList.remove('show');
        setTimeout(() => loginModal.style.display = 'none', 300);
    } else if (event.target == registerModal) {
        registerModal.classList.remove('show');
        setTimeout(() => registerModal.style.display = 'none', 300);
    }
}


document.getElementById('newsBtn').onclick = function () {
    const newsSection = document.querySelector('section');
    document.body.classList.add('fundo-branco'); 
    newsSection.style.display = 'block'; 
}


document.querySelector('a[href="#"]').onclick = function () {
    const newsSection = document.querySelector('section');
    document.body.classList.remove('fundo-branco');
    newsSection.style.display = 'none'; 
}

document.addEventListener("DOMContentLoaded", function () {
    const btnExpandir = document.getElementById("btn-exp");
    const menuLateral = document.querySelector(".menu-lateral");

    btnExpandir.addEventListener("click", function () {
        menuLateral.classList.toggle("active");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const btnExpandir = document.getElementById("btn-exp");
    const menuLateral = document.querySelector(".menu-lateral");

    btnExpandir.addEventListener("click", function () {
        menuLateral.classList.toggle("active"); 
    });
});



document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.querySelector('#registerModal form');
    const errorDiv = document.getElementById('registerError');

    registerForm.addEventListener('submit', function (event) {
        const password = registerForm.querySelector('input[name="password"]').value;
        const username = registerForm.querySelector('input[name="username"]').value;

        errorDiv.style.display = 'none';
        errorDiv.innerText = '';

        const validateInput = (input) => {
            if (input.length < 6 || input.length > 16) {
                return 'deve ter entre 6 e 16 caracteres.';
            }
            if (!/[A-Z]/.test(input)) {
                return 'deve conter pelo menos uma letra maiúscula.';
            }
            if (!/[\W_]/.test(input)) {
                return 'deve conter pelo menos um caractere especial.';
            }
            return '';
        };

        const usernameError = validateInput(username);
        if (usernameError) {
            event.preventDefault();
            errorDiv.innerText = `Usuário ${usernameError}`;
            errorDiv.style.display = 'block';
            return;
        }

        const passwordError = validateInput(password);
        if (passwordError) {
            event.preventDefault();
            errorDiv.innerText = `Senha ${passwordError}`;
            errorDiv.style.display = 'block';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.querySelector('#registerModal form');
    const errorDiv = document.getElementById('registerError');

    registerForm.addEventListener('submit', function (event) {
        event.preventDefault(); 

        const formData = new FormData(registerForm);
        const xhr = new XMLHttpRequest();

        xhr.open('POST', 'php/register.php', true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const response = xhr.responseText;

                if (response.includes('success')) {
                    const successModal = document.getElementById('successModal');
                    successModal.style.display = 'flex';
                    successModal.classList.add('show');
                    setTimeout(function () {
                        successModal.style.display = 'none';
                    }, 3000);
                } else {
                    errorDiv.innerText = response;
                    errorDiv.style.display = 'block';
                }
            }
        };
        xhr.send(formData);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('#loginModal form');
    const loginErrorDiv = document.getElementById('loginError');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); 

        const formData = new FormData(loginForm);
        const xhr = new XMLHttpRequest();

        xhr.open('POST', 'php/login.php', true); 
        xhr.onload = function () {
            if (xhr.status === 200) {
                const response = xhr.responseText;
                if (response.includes('success')) {
                    window.location.href = 'quadro-tatico.html';
                } else {
                    loginErrorDiv.innerText = response;
                    loginErrorDiv.style.display = 'block';
                }
            }
        };
        xhr.send(formData);
    });
});





