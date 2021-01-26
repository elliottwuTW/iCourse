// display navbar
document.addEventListener('DOMContentLoaded', async function () {
  try {
    const currentUser = await ajax({ method: 'get', path: '/auth/me' })
    renderNavbar(currentUser)
  } catch (err) {
    console.error(err)
    renderNavbar({ status: 'error' })
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
