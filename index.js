const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_XXX'); // Your secret key here

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('./views'));

app.use(bodyParser.urlencoded({ extended: true }))
app.post("/charge", (req, res) => {
    try {
      stripe.customers
        .create({          
          email: req.body.email,
          source: req.body.stripeToken
        })
        .then(customer =>
          stripe.charges.create({
            amount: req.body.amount * 100,
            currency: "usd",
            customer: customer.id
          })
        )
        .then(() => res.render("success.html"))        
        .catch(err => console.log(err));
    } catch (err) {
      res.send(err);
    }
  });

app.listen(3000, () => console.log('Server is running...'));