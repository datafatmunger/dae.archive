(function() {

const url = 'http://80.100.106.160/api'

function showScreen(template) {
  const content = document.querySelector(`template#${template}`).content
  const main = document.querySelector('main')
  if(main.firstChild) main.removeChild(main.firstChild)
  const screen = document.importNode(content, true)
  main.appendChild(screen)
}

function showUpload() {
  showScreen('upload')
  document.querySelector('main .upload button').addEventListener('click', async e => {
    await upload()
  })
}

async function upload() {
  const data = new FormData()
  const note = document.querySelector('.upload input[name="note"]').value
  const file = document.querySelector('.upload input[name="file"]')

  data.append('note', note)
  data.append('file', file.files[0])

  try {
    const response = await fetch(`${url}/upload`, {
      method: 'POST',
      body: data,
      credentials: 'same-origin'
    })
    const result = await response.json()
    console.log('Success:', JSON.stringify(result))
  } catch (error) {
    console.error('Error:', error)
  }
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify(data)
  })
  return await response.json();
}

async function checkAuth() {
  const res = await fetch(`${url}/users/4`, {
    credentials: 'same-origin'
  })
  console.log(res)
  return res.ok
}

async function login(email, pass) {
  const res = await postData(`${url}/users/login`, {
    email: email,
    password: pass
  })
  console.log(res)
}

async function init() {
  const ok = await checkAuth()

  if(!ok) {
    login('jbg@peerparty.org', '1X8YshljFCBMMsyVqJ-GV09A5dvzoKAb')
  } else {
    console.log("OK!")
  }
}

//init()
showUpload()

})()

