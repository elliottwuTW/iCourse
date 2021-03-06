const url = window.location.href
const cart = JSON.parse(localStorage.getItem('cart')) || []
// display navbar
document.addEventListener('DOMContentLoaded', async function () {
  try {
    const token = getCookie().token
    let currentUserResult
    if (token) {
      currentUserResult = await getCurrentUser()
      renderNavbar(currentUserResult)
    } else {
      renderNavbar({ status: 'error' })
    }

    // single group page
    if (url.match(/groups\/\d*$/)) {
      // last part of url such as "groups/7"
      await fetchAllGroupCourses(url)
    }
    // single course page
    if (url.match(/courses\/\d*$/)) {
      await fetchAllCourseReviews(url, (token ? currentUserResult.data : undefined))
    }

    // cart page
    if (url.match(/cart$/)) {
      await fetchCartCoursesInfo()
      // handle remove course from cart
      document.querySelector('#cart-body-container').addEventListener('click', cartPageHandler)
    }
  } catch (err) {
    console.error(err)
  }
})

// follow & unfollow
const groupsWrapper = document.querySelector('#groups-wrapper')
const groupWrapper = document.querySelector('#group-wrapper')
if (groupsWrapper) {
  groupsWrapper.addEventListener('click', followHandler)
}
if (groupWrapper) {
  groupWrapper.addEventListener('click', followHandler)
}

// geoSearch
const geoContainer = document.querySelector('#geo-container')
const geoCheck = document.querySelector('#geo-check')
const geoRadius = document.querySelector('#geo-radius')
if (geoCheck) {
  geoCheck.addEventListener('click', e => getLocation())
}

// query a group courses
const tuition = document.querySelector('#tuitionRange')
const hours = document.querySelector('#hoursRange')
const orderCourse = document.querySelector('#order-course')
if (url.match(/groups\/\d$/)) {
  tuition.addEventListener('change', e => {
    const query = { tuition: tuition.value, hours: hours.value, order: orderCourse.value }
    fetchAllGroupCourses(url, query)
  })
  hours.addEventListener('change', e => {
    const query = { tuition: tuition.value, hours: hours.value, order: orderCourse.value }
    fetchAllGroupCourses(url, query)
  })
  orderCourse.addEventListener('change', e => {
    const query = { tuition: tuition.value, hours: hours.value, order: orderCourse.value }
    fetchAllGroupCourses(url, query)
  })
}

// single course - display add/remove course to/from cart
const courseCart = document.querySelector('#course-cart')
if (courseCart) {
  const courseId = courseCart.dataset.courseId
  if (cart.includes(courseId)) {
    courseCart.innerHTML = `<button class="btn btn-warning remove-from-cart" data-course-id="${courseId}">移出購物車</button>`
  } else {
    courseCart.innerHTML = `<button class="btn btn-success add-to-cart" data-course-id="${courseId}">加入購物車</button>`
  }
  // cart operation handler
  courseCart.addEventListener('click', cartHandler)
}

/**
 * Functions
 */

async function getCurrentUser () {
  return await ajax({ method: 'get', path: '/auth/me' })
}

// get current location and generate geometry search anchor tag
function getLocation () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition)
  } else {
    geoContainer.innerHTML = 'Geolocation is not supported by this browser.'
  }
}

function showPosition (position) {
  const radius = geoRadius.value
  // direct to searching by radius
  window.location.href = `/groups/radius/${position.coords.latitude}/${position.coords.longitude}/${radius}`
}

// follow/unfollow handler
async function followHandler (event) {
  try {
    const target = event.target
    const clickFollow = target.matches('.btn-follow')
    const clickUnfollow = target.matches('.btn-unfollow')
    // follow/unfollow a group
    if (clickFollow || clickUnfollow) {
      const groupId = target.dataset.group
      if (clickFollow) {
        await ajax({ method: 'post', path: `/follows/${groupId}` })
      } else {
        await ajax({ method: 'delete', path: `/follows/${groupId}` })
      }

      // change to follow/unfollow button
      target.innerHTML = clickFollow ? 'Unfollow' : 'Follow'
      target.className = clickFollow ? 'btn btn-warning btn-unfollow' : 'btn btn-primary btn-follow'
    }
  } catch (err) {
    console.log(err)
  }
}

// axios request
async function ajax (option) {
  // api url
  const DOMAIN = 'https://icourse-api.herokuapp.com'
  const BASE_URL = DOMAIN + '/api/v1'
  const token = getCookie().token || null

  let res
  const url = BASE_URL + option.path
  const data = option.data ? option.data : {}
  const config = { headers: { authorization: `Bearer ${token}` } }
  switch (option.method) {
    case 'get':
      res = await axios.get(url, config)
      break
    case 'post':
      res = await axios.post(url, data, config)
      break
    case 'put':
      res = await axios.put(url, data, config)
      break
    case 'delete':
      res = await axios.delete(url, { ...data, ...config })
      break
    default:
      break
  }
  return res.data
}

// get cookie
function getCookie () {
  const cookieItems = document.cookie.split(';')
  const cookie = {}
  cookieItems.forEach(item => {
    const pair = item.split('=')
    cookie[pair[0]] = pair[1]
  })
  return cookie
}

// render navbar HTML
function renderNavbar (response) {
  const navbarContainer = document.querySelector('#navbar-container')
  navbarContainer.innerHTML = ''
  // cart
  navbarContainer.innerHTML += '<a href="/cart"><button class="btn btn-outline-info my-2 my-sm-0 mr-2">Cart</button></a>'
  if (response.status === 'success') {
    const user = response.data
    navbarContainer.innerHTML += (user.role !== 'admin')
      ? ''
      : '<a href="/admin" style="color: white;margin-right: 10px;">Admin 後台</a>'

    navbarContainer.innerHTML += `
      <span style="color: white;margin-right: 10px;">Hi, ${user.name} </span>
      <a href="/users/${user.id}/profile" style="color: white;margin-right: 10px;">Profile</a>
      <a href="/auth/logout"><button class="btn btn-outline-success my-2 my-sm-0">Logout</button></a>
    `
  } else {
    navbarContainer.innerHTML += `
      <a href="/auth/register"><button class="btn btn-outline-primary my-2 my-sm-0">Register</button></a>
      <a href="/auth/login"><button class="btn btn-outline-success my-2 my-sm-0">Login</button></a>
    `
  }
}

function deleteCheck () {
  return window.confirm('確認要刪除?')
}

// fetch all group courses based on query
async function fetchAllGroupCourses (url, query = {}) {
  const groupId = url.slice(url.lastIndexOf('/') + 1)
  const coursesResult = await ajax({ method: 'get', path: `/groups/${groupId}/courses?page=1&limit=99999&${generateQueryParam(query)}` })
  console.log(coursesResult)
  renderGroupCourses(coursesResult.data)
}

// fetch all course reviews
async function fetchAllCourseReviews (url, currentUser) {
  const courseId = url.slice(url.lastIndexOf('/') + 1)
  const reviewsResult = await ajax({ method: 'get', path: `/courses/${courseId}/reviews?page=1&limit=99999` })
  renderCourseReviews(reviewsResult.data, currentUser)
}

// generate query params for fetching group's courses
function generateQueryParam (query) {
// { tuition: tuition.value, hours: hours.value, order: orderCourse.value }
  const queryArray = Object.entries(query)

  // generate query params
  const queryParam = []
  queryArray.forEach(item => {
    // order
    if (item[0] === 'order' && item[1] !== '') {
      queryParam.push(`order=-${item[1]}`)
    }
    // tuition
    if (item[0] === 'tuition') {
      switch (item[1]) {
        case '-5000':
          queryParam.push('tuition[lte]=5000')
          break
        case '5001-10000':
          queryParam.push('tuition[gt]=5000&tuition[lte]=10000')
          break
        case '10001-15000':
          queryParam.push('tuition[gt]=10000&tuition[lte]=15000')
          break
        case '15001-20000':
          queryParam.push('tuition[gt]=15000&tuition[lte]=20000')
          break
        case '20000-':
          queryParam.push('tuition[gt]=20000')
          break
        default:
          break
      }
    }
    // hours
    if (item[0] === 'hours') {
      switch (item[1]) {
        case '1-20':
          queryParam.push('hours[gte]=1&hours[lte]=20')
          break
        case '21-40':
          queryParam.push('hours[gte]=21&hours[lte]=40')
          break
        case '41-60':
          queryParam.push('hours[gte]=41&hours[lte]=60')
          break
        case '61-':
          queryParam.push('hours[gte]=61')
          break
        default:
          break
      }
    }
  })

  return queryParam.join('&')
}

// render courses of a group
function renderGroupCourses (courses) {
  const coursesContainer = document.querySelector('#courses-container')
  // groups course - display add/remove course to/from cart
  coursesContainer.addEventListener('click', cartHandler)

  coursesContainer.innerHTML = ''
  courses.forEach(course => {
    const photo = course.photo ? course.photo : 'https://i.imgur.com/5UyZUWd.png'
    coursesContainer.innerHTML += `
    <div class="col-md-4">
      <div class="card mb-4 shadow-sm">
        <img class="card-img-top" src="${photo}" alt="Card image cap" width="286px" height="180px">
        <div class="card-body">
          <p class="card-text">
            <a href="/courses/${course.id}">
              ${course.name}
            </a>
          </p>
          <p class="card-text d-flex justify-content-between">
            <span><b>$${course.tuition}</b></span>
            <span style="color: #54A2B0;"><b>${course.hours} hrs</b></span>
          </p>
          <p class="card-text">${course.description}</p>
          ${cart.includes(String(course.id)) ?
            `<button class="btn btn-warning remove-from-cart" data-course-id=${course.id}>移出購物車</button>` :
            `<button class="btn btn-success add-to-cart" data-course-id=${course.id}>加入購物車</button>`
          }
        </div>
      </div>
    </div>
    `
  })
}

// render reviews of a course
function renderCourseReviews (reviews, currentUser) {
  const reviewsContainer = document.querySelector('#reviews-container')
  reviewsContainer.innerHTML = ''
  reviews.forEach(review => {
    let displayDelete = false
    if (currentUser && currentUser.id === review.UserId && currentUser.role !== 'publisher') {
      displayDelete = true
    }
    // display delete button
    reviewsContainer.innerHTML += !displayDelete ? '' : `
    <form action="/reviews/${review.id}?_method=DELETE" method="POST" style="float: right;">
    <input type="hidden" name="courseId" value="${review.CourseId}">
    <button type="submit" class="btn btn-danger" onclick="return deleteCheck()">刪除</button>
  </form>
    `
    // review content
    reviewsContainer.innerHTML += `
    <blockquote class="blockquote mb-0">
    <a ${currentUser ? `href="/users/${review.UserId}/profile"` : ''}>${review.User.name}</a>
    <footer class="blockquote-footer ml-2" style="display: inline;">${toFromNowFormat(review.createdAt)}</footer>
    <small style="color: #EB8A2F; display: block;"><b>${review.rating} / 10</b></small>
    <h6 class="mt-2">${review.title}</h6>
    <p style="font-size: medium;">${review.text}</p>
  </blockquote>
  <hr />
    `
  })
}

// format the time
function toFromNowFormat (utc) {
  return moment(utc).fromNow()
}

// add-to-cart/remove-from-cart handler
function cartHandler (event) {
  const target = event.target
  const clickAddToCart = target.matches('.add-to-cart')
  const clickRemoveFromCart = target.matches('.remove-from-cart')
  if (clickAddToCart || clickRemoveFromCart) {
    const courseId = target.dataset.courseId
    // add to cart
    if (clickAddToCart) {
      cart.push(courseId)
      target.classList.remove('btn-success', 'add-to-cart')
      target.classList.add('btn-warning', 'remove-from-cart')
      target.innerText = '移出購物車'
    } else {
      cart.splice(cart.indexOf(courseId), 1)
      target.classList.remove('btn-warning', 'remove-from-cart')
      target.classList.add('btn-success', 'add-to-cart')
      target.innerText = '加入購物車'
    }
    updateCartLocalStorage()
  }
}

// update cart array to local storage
function updateCartLocalStorage () {
  localStorage.setItem('cart', JSON.stringify(cart))
}

// fetch courses info by course ids in cart and render cart page
async function fetchCartCoursesInfo () {
  try {
    const courses = await Promise.all(cart.map(courseId => ajax({
      method: 'get',
      path: `/courses/${courseId}`
    })))
    await renderCartPage(courses.map(course => course.data))
  } catch (err) {
    console.error(err)
  }
}

// render course info in the cart page
async function renderCartPage (courses) {
  const totalPrice = courses.reduce((acc, cur, index, arr) => {
    cur = arr[index].tuition
    return acc + cur
  }, 0)

  const cartBodyContainer = document.querySelector('#cart-body-container')
  const orderContainer = document.querySelector('#order-container')
  cartBodyContainer.innerHTML = ''
  courses.forEach(course => {
    const photo = course.photo ? course.photo : 'https://i.imgur.com/5UyZUWd.png'
    cartBodyContainer.innerHTML += `
      <tr>
        <td>
          <div style="display: flow-root;">
            <img src="${photo}" class="card-img" alt="..." style="height: 50px;width: auto;">
            <a href="/courses/${course.id}"><span>${course.name}</span></a>
          </div>
        </td>
        <td>
          <p>$ ${course.tuition}</p>
        </td>
        <td>
          <button class="btn btn-warning remove-from-cart" data-course-id=${course.id}>移出購物車</button>
        </td>
      </tr>
    `
  })
  cartBodyContainer.innerHTML += `
  <tr>
    <td></td>
    <td>
      <h2>Total: ${totalPrice}</h2>
    </td>
  </tr>
  `

  // form to create order
  const courseInfo = {}
  courses.forEach(course => {
    courseInfo[course.id] = course.tuition
  })
  orderContainer.innerHTML = `
    <form action="/orders" method="POST" onsubmit="clearCart()">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" id="name" placeholder="Enter name" name="name" required>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="text" class="form-control" id="email" placeholder="Enter email" name="email" required>
      </div>
      <input type="hidden" name="amount" value="${totalPrice}">
      <input type="hidden" name="courseInfoString" value=${JSON.stringify(courseInfo)}>
      ${getCookie().token ? '<button type="submit" class="btn btn-primary">馬上下訂</button>' : '<em>登入，即可下訂</em>'}
    </form>
  `
}

function clearCart () {
  cart.splice(0, cart.length)
  updateCartLocalStorage()
}

// handle remove course from cart
async function cartPageHandler (event) {
  const target = event.target
  const clickRemoveFromCart = target.matches('.remove-from-cart')
  if (clickRemoveFromCart) {
    const courseId = target.dataset.courseId
    cart.splice(cart.indexOf(courseId), 1)
    updateCartLocalStorage()

    // refetch and reload
    await fetchCartCoursesInfo()
  }
}
