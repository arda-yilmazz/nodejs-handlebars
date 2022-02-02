const form = document.querySelector('.form form');
const submitBtn = form.querySelector("ul li button");

const notification = (msg) => {

    const old_div = document.querySelector('.notification');

    if (old_div) {
        old_div.remove();
    }

    const notification = document.createElement('div');
    notification.innerText = msg;
    notification.className = 'notification';
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('active'), 1);

    setTimeout(() => notification.classList.remove('active'), 2000);
}

submitBtn.addEventListener("click", (e) => {
    const password = form.querySelector('ul li input[name="password"]');
    const repassword = form.querySelector('ul li input[name="repassword"]');

    if (password.value !== repassword.value) {
        e.preventDefault();
        password.classList.add('error');
        repassword.classList.add('error');
        notification('Şifreler uyuşmuyor');
        return false;
    }
    return true;
});