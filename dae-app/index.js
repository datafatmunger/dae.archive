
(function() {

let auth

//const url = `${window.location.protocol}//${window.location.host}`
const url = `http://80.100.106.160`

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
//  document.querySelector('main nav li.upload').classList.add('hidden')
  document.querySelector('main nav li.login').classList.add('hidden')
//  document.querySelector('main nav li.archive').classList.add('hidden')
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
  document.querySelector('main .search button.go').addEventListener('click', async e => { doSearch() })
  document.querySelector('main .search input').addEventListener('keyup', async e => { if(e.keyCode === 13) 
  doSearch() })
  doSearch()
}

function showMenu() {
  showElm('menu', 'main')
  let uploadButton = document.querySelector('main nav li.upload')
  let archiveButton = document.querySelector('main nav li.archive')
    
// Hides Upload + Personal Archive links whem user not logged in — KM
    
  if(auth) {
    uploadButton.classList.remove('hidden')
    archiveButton.classList.remove('hidden')
  } else {
    uploadButton.classList.add('hidden')
    archiveButton.classList.add('hidden')
  }
    
  const items = document.querySelectorAll('main nav li')
  items.forEach(i => i.addEventListener('click', async e => {
    const c = e.target.classList[0]
    if(c === 'search') showSearch()
    else if(c === 'upload') showUpload()
    else if(c === 'login') showLogin()
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
    
// Shows a random image and it's metadata upon reload — KM

//async function feedMe(randomResult) {
//    let allResults = await search('*', '&sort=ext+asc')
//    let allFeedItems = allResults.response.docs
//    let FilteredFeedItems = allFeedItems.filter(function (el) {
//         return el.ext == 'png' || 
//                el.ext == 'jpeg' || 
//                el.ext == 'jpg' || 
//                el.ext == 'gif'     
//    })
//    let randomItem = FilteredFeedItems[Math.floor(Math.random()*FilteredFeedItems.length)]
////    console.log(randomItem)
//    
//    let randomItemAuthor = randomItem.user
//    document.querySelector('#itemAuthor').innerHTML = randomItemAuthor + " uploaded a file named"
//    
//    let randomItemName = randomItem.name
//    document.querySelector('#itemName').innerHTML = ' "' + randomItemName + '"'
//    
//    let randomItemIMGpath = `${url}` + randomItem.path.replace('archive/','') + '/' + randomItem.name
//    document.querySelector('#feedItemIMG').setAttribute('src', randomItemIMGpath)
//    
//    let randomItemLink = randomItemIMGpath
//    document.querySelector('#feedItemLink').setAttribute('href', randomItemIMGpath)
//    document.querySelector('#feedItemLink').innerHTML = randomItemIMGpath
//    
//    let randomItemContents = randomItem.tf_tags
//    if (randomItemContents && randomItemContents.length >= 3) {
//        document.querySelector('#itemContents').innerHTML = ', containing "' + randomItemContents[0] + '", "' + randomItemContents[1] + '", and ' + '"' +  randomItemContents[3] +'"'
//    }
//
//    let randomItemColors = randomItem.colors
//    if (randomItemColors && randomItemColors.length >= 2) {
//        document.querySelector('#itemColors').innerHTML = '. The colors "' + randomItemColors[0] + '", and ' + '"' + randomItemColors[1] +'" are common.'
//    }
//}

// display object contents and metadata in feed window
    
async function inspectFile() {
    let searchinput = document.querySelector('main .search input[name="search"]').value
    const txt = searchinput === "" ? "*" : searchinput  
    const srt = "&sort=date+desc"
    const allResults = await search(txt, srt)
    let allFeedItems = allResults.response.docs
    let randomItem = allFeedItems[Math.floor(Math.random()*allFeedItems.length)]    
    let randomItemPath = `${url}` + randomItem.path.replace('archive/','') + '/' + randomItem.name
    
    if (randomItem.ext == 'png'|| 
        randomItem.ext == 'jpeg' || 
        randomItem.ext == 'jpg' || 
        randomItem.ext == 'gif') {
        document.querySelector('#feedItemIMG').setAttribute('src', randomItemPath)
        document.querySelector('#feedItemIMG').style.display = 'block'
        document.querySelector('#feedItemContents').style.display = 'none'
    } else if (randomItem.hasOwnProperty('contents')) {
        document.querySelector('#feedItemContents').innerHTML = randomItem.contents
        document.querySelector('#feedItemIMG').style.display = 'none'
        document.querySelector('#feedItemContents').style.display = 'block'
    } else {
        document.querySelector('#feedItemContents').innerHTML = "<p>Could not load file contents :( <br><a href=" + randomItemPath + ">" + randomItemPath + "</a></p>"
        document.querySelector('#feedItemIMG').style.display = 'none'
        document.querySelector('#feedItemContents').style.display = 'block'
    }
    
    function syntaxHighlight(json) {
        if (typeof json != 'string') {
             json = JSON.stringify(json, undefined, 6);
        }
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return ('<span class="' + cls + '">' + match + '</span>').replace(/\"/g, "")
        });
    }
    document.querySelector('#feedItemMeta').innerHTML = syntaxHighlight(randomItem)
    
    console.log(randomItem)
    searchThis()
}
     
// run search and refrersh feed based on click metadata
    
function searchThis() {
    items = document.querySelectorAll(".string")
    items.forEach(i => i.addEventListener('click', async e => {
        let searchQuery = e.target.innerHTML
        console.log(searchQuery)
        document.querySelector('main .search input[name="search"]').value = searchQuery
        let newCheckPoint = document.createElement('span').innerHTML = searchQuery + " → "
        document.querySelector('#feedItemTravelHistory').append(newCheckPoint)
        const txt = searchQuery
        const srt = "&sort=date+desc"
        const res = await search(txt, srt)
        showResults(res)
        inspectFile()
    }))
}

async function doSearch() {
// always display all items in archive — KM
  let searchinput = document.querySelector('main .search input[name="search"]').value
  const txt = searchinput === "" ? "*" : searchinput  
  const srt = "&sort=date+desc"
  const res = await search(txt, srt)
  showResults(res)
}
    
let direction = true
    
async function pickSortCategory(sortCategory) {
    let searchinput = document.querySelector('main .search input[name="search"]').value
    const txt = searchinput === "" ? "*" : searchinput 
    direction = !direction
    let sortinput = sortCategory === "type" ? "&sort=ext+asc" : "&sort=" + sortCategory + (direction ? "+asc" : "+desc")
    let srt = sortinput
    const res = await search(txt, srt)
    showResults(res)
    console.log(res, "brought to you by doSort()")
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
  const data = new FormData()
  const note = document.querySelector('main .upload input[name="note"]').value
  const file = document.querySelector('main .upload input[name="file"]')

  if(note && note.length > 0) data.append('note', note)
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
  }
}

async function init() {
  auth = await checkAuth()
  showSearch()
  doSort()
  inspectFile()
  auth 
       ? document.querySelector('main nav li.login').classList.add('hidden') 
       : document.querySelector('main nav li.login').classList.remove('hidden')
}
    
init()

})()

