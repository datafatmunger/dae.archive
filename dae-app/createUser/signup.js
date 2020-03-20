const url = `${window.location.protocol}//${window.location.host}`

document.querySelector('input[name="password"]').addEventListener('keyup', async e => {
      if(e.keyCode === 13) createUser()
  })

function showMsg(txt, err = false) {
  const msg = document.querySelector('.msg')
  msg.innerHTML = txt
  if(err) msg.classList.add('error')
  else msg.classList.remove('error')
}

async function createUser() {
  const email = document.querySelector('input[name="email"]').value
  const name = document.querySelector('input[name="name"]').value
  const password = document.querySelector('input[name="password"]').value
  
  if (email &&
      name &&
      password &&
      email.indexOf('@') &&
      password.length > 7) {
  
      const res = await postData(`${url}/api/users`, {
        email: email,
        name: name,
        password: password
      })

      if(res.status === 200) {
        showMsg(`Success! You can find your repository and some instructions here:<br><br><a href="${url}/${name}/"> ${url}/${name}/</a>`)
        document.querySelector('.msg').style.color = 'black'
      } else {
        showMsg('Server fail. Better tell JBG. :(')
        document.querySelector('.msg').style.color = 'red'
      }
    } else {
      showMsg('Fail! Make sure your name and email are unique and your password contains at least 8 characters.')
      document.querySelector('.msg').style.color = 'red'
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
