// display navbar
document.addEventListener('DOMContentLoaded', async function () {
  try {
    const res = await fetchCurrentUser()
    renderNavbar(res.data)
  } catch (err) {
    console.error(err)
    renderNavbar({ status: 'error' })
  }
})

async function fetchCurrentUser () {
  // api url
  const DOMAIN = 'http://localhost:3000'
  const BASE_URL = DOMAIN + '/api/v1'

  const token = getCookie().token || null

  return await axios.get(BASE_URL + '/auth/me', {
    headers: { authorization: `Bearer ${token}` }
  })
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
      <span style="color: white;margin-right: 10px;">Hi, ${user.name}</span>
      <a href="/users/profile" style="color: white;margin-right: 10px;">Profile</a>
      <a href="/auth/logout"><button class="btn btn-outline-success my-2 my-sm-0">Logout</button></a>
    `
  } else {
    navbarContainer.innerHTML += `
      <a href="/auth/register"><button class="btn btn-outline-primary my-2 my-sm-0">Register</button></a>
      <a href="/auth/login"><button class="btn btn-outline-success my-2 my-sm-0">Login</button></a>
    `
  }
}
