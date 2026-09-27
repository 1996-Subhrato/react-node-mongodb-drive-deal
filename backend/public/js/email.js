async function sendMail(email,name,status)
{
    var res = await fetch('/admin/send-email', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: email,
            status:status,
            name:name
        })
    });
    res = await res.json();
    // console.log(res.message);
    if (res.error)
    {
        Qual.errordb("Error", res.message);

    } else
    {
        Qual.successdb("Success", res.message);
    }
}