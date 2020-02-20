

const sgMail=require("@sendgrid/mail")
sgMail.setApiKey("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")

const sendWelcomeEmail= (email,url)=>
{
    console.log(url)
    console.log(email)
    sgMail.send({
        to: email,
        from: 'be10498.17@bitmesra.ac.in',
        subject: 'Thankyou for Signing up on ASAP Insurance',
        text: "Please Click on the below link to verify your account ",
       html:'Please Click here to confirm your email ' + url ,
      })
}

// const sendExitEmail= (email,name)=>
// {
//     sgMail.send({
//         to: email,
//         from: 'cprateekrai@gmail.com',
//         subject: 'Exit',
//         text: "Thanks "+name+" for Using our App"
//        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//       })
// }

const Emails={
    sendWelcomeEmail,
}



module.exports=Emails