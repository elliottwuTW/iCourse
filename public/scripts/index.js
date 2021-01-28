// display navbar
document.addEventListener('DOMContentLoaded', async function () {
  try {
    if (getCookie().token) {
      const currentUser = await ajax({ method: 'get', path: '/auth/me' })
      renderNavbar(currentUser)
    } else {
      renderNavbar({ status: 'error' })
    }
  } catch (err) {
    console.error(err)
  }
})

const url = window.location.href
// single group page
if (url.match(/groups\/\d$/)) {
  // last part of url such as "groups/7"
  fetchAllGroupCourses(url)
}

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

/**
 * Functions
 */

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
  const DOMAIN = 'http://localhost:3000'
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
  renderGroupCourses(coursesResult.data)
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
  coursesContainer.innerHTML = ''
  courses.forEach(course => {
    coursesContainer.innerHTML += `
    <div class="col-md-4">
      <div class="card mb-4 shadow-sm">
        <img class="card-img-top" src="${course.photo}" alt="Card image cap" width="286px" height="180px">
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
        </div>
      </div>
    </div>
    `
  })
}
