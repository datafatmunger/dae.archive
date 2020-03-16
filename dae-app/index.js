
(function() {

let auth

const url = `${window.location.protocol}//${window.location.host}`

// UI Stuff - JBG

function showElm(template, sel, empty = true) {
  const content = document.querySelector(`template#${template}`).content
  const elm = document.querySelector(sel)
  if(empty) elm.innerHTML = ''
  const node = document.importNode(content.firstElementChild, true)
  elm.appendChild(node)
  return node
}

function showLogin() {
  showMenu()
  document.querySelector('main nav li.login').classList.add('hidden')
  showElm('login', 'main', false)
  document.querySelector('main .login button').addEventListener('click', async e => {
    await login()
  })
  document.querySelector('#email').addEventListener('keyup', async e => {
    if(e.keyCode === 13)
        await login()
    })
  document.querySelector('#pass').addEventListener('keyup', async e => {
    if(e.keyCode === 13)
        await login()
    })
}

function showUpload() {
  showMenu()
  showElm('upload', 'main', false)
  document.querySelector('main nav li.upload').innerHTML = 'search'
  document.querySelector('main nav li.upload').addEventListener('click', async e => {
    await showSearch()
  })
  document.querySelector('main nav li.login').classList.add('hidden')
  document.querySelector('main .upload button').addEventListener('click', async e => {
    await upload()
  })
  document.querySelector('main .upload #note').addEventListener('keyup', async e => {
    if(e.keyCode === 13)
        await upload()
    })
}

function showSearch() {
  showMenu()
  document.querySelector('main nav li.login').classList.add('hidden')
  showElm('search', 'main', false)
  document.querySelector('main .search button.go').addEventListener('click', async e => { 
    doSearch() 
  })
  document.querySelector('main .search input').addEventListener('keyup', async e => {
      if(e.keyCode === 13) doSearch()
  })
}

function showSorting() {
    document.querySelector('.sorting').classList.add('visible')
    //console.log("visible?")
    document.querySelector('#query').innerHTML = document.querySelector('main .search input[name="search"]').value
}
    
function moveSearchField() { 
    document.querySelector('.searchField').style.marginTop = '-30px'
//    document.querySelector('.search').style.position = 'absolute'
//    document.querySelector('.search').style.top = '0px'
}

function showMenu() {
  showElm('menu', 'main')
  let uploadButton = document.querySelector('main nav li.upload')
  let archiveButton = document.querySelector('main nav li.archive')
  let browseButton = document.querySelector('main nav li.browse')
  let aboutButton = document.querySelector('main nav li.about')
  let logoutButton = document.querySelector('main nav li.logout')

// Hides Upload + Personal Archive links whem user not logged in — KM

  if(auth) {
    uploadButton.classList.remove('hidden')
    archiveButton.classList.remove('hidden')
    logoutButton.classList.remove('hidden')
  } else {
    uploadButton.classList.add('hidden')
    archiveButton.classList.add('hidden')
    logoutButton.classList.add('hidden')
  }

  const items = document.querySelectorAll('main nav li')
  items.forEach(i => i.addEventListener('click', async e => {
    const c = e.target.classList[0]
    if(c === 'search') showSearch()
    else if(c === 'upload') showUpload()
    else if(c === 'login') showLogin()
    else if(c === 'logout') await logout()
  }))
  document.querySelector('main nav li.archive a').setAttribute('href', `${url}/${username}`)
  document.querySelector('main nav li.archive a').innerHTML =`${username}`
}

function showResults(res) {
  // Remove old results - JBG
  document.querySelectorAll('main .search .results .res').forEach(n => n.remove())

  if(res.response.numFound == 0) showMsg("0 results.")
  else {
    const msg = document.querySelector('main .msg')
    msg.style.display = 'none'
  }

  // Add new results - JBG
  res.response.docs.forEach(d => {
    const node = showElm('res', 'main .search .results', false)
    const link = node.querySelector('a')
    link.innerHTML = d.name
    link.setAttribute('href', `${d.path.replace('/archive', '')}/${d.name}`)
    node.querySelector('.user').innerHTML = d.user
    node.querySelector('.date').innerHTML = d.date
  })
}

function showMsg(txt, err = false) {
  const msg = document.querySelector('main .msg')
  msg.innerHTML = txt
  msg.style.display = 'block'
  if(err) msg.classList.add('error')
  else msg.classList.remove('error')
}

async function doSearch() {
// always display all items in archive — KM
      let searchinput = document.querySelector('main .search input[name="search"]').value
      const txt = searchinput.length === 0 ? "*" : searchinput
      const srt = "&sort=date+desc"
      const res = await search(txt, srt)
      showSorting() 
      moveSearchField()
      showResults(res)
}

let direction = true

async function pickSortCategory(sortCategory) {
    let searchinput = document.querySelector('main .search input[name="search"]').value
    const txt = searchinput.length === 0 ? "*" : searchinput
    direction = !direction
    let sortinput = sortCategory === "type" ? "&sort=ext+asc" : "&sort=" + sortCategory + (direction ? "+asc" : "+desc")
    let srt = sortinput
    const res = await search(txt, srt)
    showResults(res)
//    console.log(res, "brought to you by doSort()")
}

function doSort() {
  const items = document.querySelectorAll('.sortCategory')
  items.forEach(i => i.addEventListener('click', e => {
    const c = e.target.classList[1]
    if(c === 'name') pickSortCategory(c)
    else if(c === 'type') pickSortCategory(c)
    else if(c === 'date') pickSortCategory(c)
  }))
}

async function upload() {
  const note = document.querySelector('main .upload input[name="note"]').value
  const file = document.querySelector('main .upload input[name="file"]')
  const data = new FormData()

  if(note && note.length > 0) data.append('note', note)
  data.append('file', file.files[0])

  try {
    const response = await fetch(`${url}/api/files`, {
      method: 'POST',
      body: data,
      credentials: 'same-origin'
    })
    const result = await response.json()
    showMsg('Success! Your file has been uploaded and will be indexed and searchable after 02:05am tomorrow.')
  } catch (error) {
    showMsg('Fail.', true)
  }
}

async function postData(url = '', data = {}) {
  const res = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify(data)
  })
  return await res.json();
}

let username

async function checkAuth() {
  const res = await fetch(`${url}/api/users/me`, { credentials: 'same-origin' })
  const data = await res.json()
  username = data.name
  return res.ok
}

async function search(txt, srt) {
  const res = await fetch(`${url}/search?q=${txt}&rows=300${srt}`, { credentials: 'same-origin' })
  return await res.json()
}

async function logout() {
  const res = await fetch(`${url}/api/users/logout`, {
    credentials: 'same-origin',
    method: 'DELETE'
  })
  const data = await res.json()
  auth = false
  showSearch()
  return res.ok
}

async function login() {
  const email = document.querySelector('main .login input[name="email"]').value
  const pass = document.querySelector('main .login input[name="password"]').value
  const res = await postData(`${url}/api/users/login`, {
    email: email,
    password: pass
  })
  if(res.error) showMsg(res.error, true)
  else {
    auth = true
    username = res.name
    showSearch()
    doSort()
  }
}

async function init() {
  auth = await checkAuth()
  showSearch()
//  uncomment below line to run empty search and display list of files on page load
//  doSearch() 
  doSort()
  auth
       ? document.querySelector('main nav li.login').classList.add('hidden')
       : document.querySelector('main nav li.login').classList.remove('hidden')
}

init()

})()
