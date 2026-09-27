async function sendMail(email,name,status,vehicle_name)
{
    var res = await fetch('/dealer/send-email', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: email,
            status:status,
            name:name,
            vehicle_name:vehicle_name
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