async function checkuser() {

    var res = await fetch('/user/token');
    res = await res.json();
    // console.log(res.error);
    var html = ``;
    if (res.error) {
        html += `<a href="">USER</a>
                                        <ul class="sub-menu">
                                            <li><a href="/user/login">LOGIN</a></li>
                                            <li><a href="/user/signup">SIGN-UP</a></li>
                                        </ul>`;
    } else {
        html += `<a href="/user/dashboard" >MY ACCOUNT</a>`;
    }
    document.getElementById('checkLogin').innerHTML = html;
}