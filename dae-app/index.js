(function() {

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
  showElm('login', 'main')
  document.querySelector('main .login button').addEventListener('click', async e => {
    await login()
  })
}

function showUpload() {
  showMenu()
  showElm('upload', 'main', false)
  document.querySelector('main .upload button').addEventListener('click', async e => {
    await upload()
  })
}

function showSearch() {
  showMenu()
  showElm('search', 'main', false)
  document.querySelector('main .search button').addEventListener('click', async e => { doSearch() })
  document.querySelector('main .search input').addEventListener('keyup', async e => { if(e.keyCode === 13) doSearch() })
}

function showMenu() {
  showElm('menu', 'main')
  const items = document.querySelectorAll('main nav li')
  items.forEach(i => i.addEventListener('click', async e => {
    const c = e.target.classList[0]
    if(c === 'search') showSearch()
    else if(c === 'upload') showUpload()
    
  }))
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
  const txt = document.querySelector('main .search input[name="search"]').value
  const res = await search(txt)
  showResults(res)
}

async function upload() {
  const data = new FormData()
  const note = document.querySelector('main .upload input[name="note"]').value
  const file = document.querySelector('main .upload input[name="file"]')

  data.append('note', note)
  data.append('file', file.files[0])

  try {
    const response = await fetch(`${url}/api/upload`, {
      method: 'POST',
      body: data,
      credentials: 'same-origin'
    })
    const result = await response.json()
    showMsg('Success!')
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

async function checkAuth() {
  const res = await fetch(`${url}/api/users/me`, { credentials: 'same-origin' })
  console.log(res)
  return res.ok
}

async function search(txt) {
  const res = await fetch(`${url}/search?q=${txt}`, { credentials: 'same-origin' })
  return await res.json()
}

async function login() {
  const email = document.querySelector('main .login input[name="email"]').value
  const pass = document.querySelector('main .login input[name="password"]').value
  const res = await postData(`${url}/api/users/login`, {
    email: email,
    password: pass
  })
  if(res.error) showMsg(res.error, true)
  else showSearch()
}

async function init() { await checkAuth() ? showSearch() : showLogin() }

init()

})()

