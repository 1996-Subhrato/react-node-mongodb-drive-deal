async function checkdealer()
{
    // console.log("dealer");
    var res = await fetch('/dealer/token');
    res = await res.json();
    // console.log(res.error);
    var html = ``;
    if (res.error) {
        html += `<a href="">COMPANY</a>
                                        <ul class="sub-menu">
                                            <li><a href="/dealer/login">LOGIN</a></li>
                                            <li><a href="/dealer/signup">SIGN-UP</a></li>
                                        </ul>`;
    } else {
        html += `<a href="/dealer/dashboard" class="nav-link">MY DEALERSHIPS</a>`;
    }
    document.getElementById('checkdealer').innerHTML = html;
}