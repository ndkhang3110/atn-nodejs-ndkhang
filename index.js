const express = require('express')
const path = require('path')
const { Client } = require('pg');
const cors = require('cors');

const connectionString = "postgres://abeeiqkvchkhqx:076df05466024cad826f8e010952ce65f8bc92e0cc210c004e81c314d65afe45@ec2-52-202-146-43.compute-1.amazonaws.com:5432/d7cge1e1uhe5f9"

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.listen(PORT, () => console.log(`Listening on ${PORT}`))


const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

//Agency
app.get("/api/agency/all", (request, response) => {
  try {
    client.query("SELECT * FROM agency;", (err, res) => {
      response.send(res.rows)
    })
  } catch (error) {
    console.log(error)
  }
})

//Customer
app.post('/api/customer/register', (request, response) => {
  const name = request.query.name
  const email = request.query.email
  const password = request.query.password

  try {
    client.query("INSERT INTO customer (customer_name, customer_email, customer_password, customer_created_at) VALUES ($1, LOWER($2), $3, current_timestamp);",
      [name, email, password],
      (err, res) => {
        if (err) {
          console.log(err)
        } else {
          response.send("Done")
        }
      })
  } catch (error) {
    console.log(error)
  }
})

app.get("/api/cusomer/login", (request, response) => {
  const email = request.query.email
  const password = request.query.password
  try {
    client.query("SELECT * FROM customer where customer_email = LOWER($1) customer_password = $2;", [email, password], (err, res) => {
      response.send(res.rows)
    })
  } catch (error) {
    console.log(error)
  }
})


app.get("/api/customer/all", (request, response) => {
  try {
    client.query("SELECT * FROM customer;", (err, res) => {
      response.send(res.rows)
    })
  } catch (error) {
    console.log(error)
  }
})

//Product
app.get("/api/product/all", (request, response) => {
  try {
    client.query("SELECT * FROM product;", (err, res) => {
      response.send(res.rows)
    })
  } catch (error) {
    console.log(error)
  }
})

app.get("/api/product/category", (request, response) => {
  const id = request.query.id
  try {
    client.query("SELECT * FROM product where category_id = $1;", [id], (err, res) => {
      response.send(res.rows)
    })
  } catch (error) {
    console.log(error)
  }
})

app.get("/api/product/category", (request, response) => {
  const id = request.query.id
  try {
    client.query("SELECT * FROM product where category_id = $1;", [id], (err, res) => {
      response.send(res.rows)
    })
  } catch (error) {
    console.log(error)
  }
})

app.post('/api/product/addproduct', (request, response) => {
  const productCategory = request.query.productCategory
  const productSupplier = request.query.productSupplier
  const productName = request.query.productName
  const productPrice = request.query.productPrice
  const productQuantity = request.query.productQuantity
  const productImage = request.query.productImage

  try {
    client.query("INSERT INTO product (supplier_id, category_id, product_name, product_price, product_image, product_quantity, product_status, product_created_at) VALUES ($1, $2, $3, $4, $5, $6, true, current_timestamp);",
      [productSupplier, productCategory, productName, productPrice, productImage, productQuantity],
      (err, res) => {
        if (err) {
          console.log(err)
        } else {
          response.send("Done")
        }
      })
  } catch (error) {
    console.log(error)
  }
})

//Employee
app.get("/api/employee/all", (request, response) => {
  try {
    client.query("SELECT * FROM employee;", (err, res) => {
      response.send(res.rows)
    })
  } catch (error) {
    console.log(error)
  }
})

app.get("/api/employee/login", (request, response) => {
  const email = request.query.email
  const password = request.query.password
  try {
    client.query("SELECT * FROM employee where employee_email = LOWER($1) AND employee_password = $2;", [email, password], (err, res) => {
      response.send(res.rows)
    })
  } catch (error) {
    console.log(error)
  }
})

app.post("/api/employee/register", (request, respone) => {
  const angencyId = request.query.angencyId
  const employeeName = request.query.employeeName
  const employeeEmail = request.query.employeeEmail
  const employeePassword = request.query.employeePassword
  try {
    client.query("INSERT INTO employee (agency_id, employee_name, employee_email, employee_password, employee_created_at)" +
      "VALUES ($1, $2, LOWER($3), $4, current_timestamp);", [angencyId, employeeName, employeeEmail, employeePassword], (err, res) => {
        respone.send(res.rows)
      })
  } catch (error) {
    console.log(error)
  }
})


app.get("/api/orderlist/all", (request, response) => {
  try {
    client.query("SELECT order_list.order_list_id, customer.customer_name, customer.customer_id, employee.employee_id, employee.employee_name, order_list.agency_id, employee_created_at FROM order_list INNER JOIN employee ON order_list.employee_id = employee.employee_id INNER JOIN customer ON order_list.customer_id = customer.customer_id;", (err, res) => {
      response.send(res.rows)
    })
  } catch (error) {
    console.log(error)
  }
})

app.post("/api/orderlist/all", (request, response) => {
  const customerId = request.query.customerId
  const employeeId = request.query.employeeId
  try {
    client.query("INSERT INTO order_list (customer_name, employee_id, employee_created_at) VALUES ($1, $2, current_timestamp);",
      [customerId, employeeId],
      (err, res) => {
        if (err) {
          console.log(err)
        } else {
          response.send("Done")
        }
      })
  } catch (error) {
    console.log(error)
  }
})


app.get("/api/order-item/all", (request, response) => {
  const orderId = request.query.orderId
  try {
    client.query("SELECT product_name, order_item_quantity, product_price, order_list.order_list_id, product_image FROM order_list INNER JOIN order_item ON order_list.order_list_id = order_item.order_list_id INNER JOIN product ON order_item.product_id = product.product_id WHERE order_list.order_list_id = $1;", [orderId], (err, res) => {
      response.send(res.rows)
    })
  } catch (error) {
    console.log(error)
  }
})

//order-list
app.post("/api/order-list/add", (request, response) => {
  const customerId = request.query.customerId
  const agencyId = request.query.agencyId
  const employeeId = request.query.employeeId

  try {
    client.query("INSERT INTO order_list (customer_id, agency_id, employee_id) VALUES ($1, $2, $3);",
      [customerId, agencyId, employeeId],
      (err, res) => {
        if (err) {
          console.log(err)
        } else {
          response.send("Done")
        }
      })
  } catch (error) {
    console.log(error)
  }
})

app.get("/api/order-list/all", (request, response) => {
  try {
    client.query("SELECT * FROM order_list;", (err, res) => {
      response.send(res.rows)
    })
  } catch (error) {
    console.log(error)
  }
})

//order-item
app.post("/api/order-item/add", (request, response) => {
  const orderListId = request.query.orderListId
  const productId = request.query.productId
  const orderItemQuantity = request.query.orderItemQuantity

  try {
    client.query("INSERT INTO order_item (order_list_id, product_id, order_item_quantity) VALUES ($1, $2, $3);",
      [orderListId, productId, orderItemQuantity],
      (err, res) => {
        if (err) {
          console.log(err)
        } else {
          response.send("Done")
        }
      })
  } catch (error) {
    console.log(error)
  }
})


